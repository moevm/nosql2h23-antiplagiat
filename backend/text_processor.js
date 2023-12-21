import { readFileSync } from "node:fs";

const defaultNgramSize = 3;


function CalculateStringHash( str )
{
    let hash = 0;
    if ( str.length === 0 )
    {
        return hash;
    }
    for ( let i = 0; i < str.length; i++ )
    {
        const chr = str.charCodeAt( i );
        hash = ( ( hash << 5 ) - hash ) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs( hash );
}


function CalculateNgramHash( tokens )
{
    let totalHash = '';
    for ( let token of tokens )
    {
        totalHash += CalculateStringHash( token.word );
    }
    return totalHash;
}


function PreprocessFile( fileContent, ngramSize )
{
    let result = [];
    let index = 0;
    let inToken = false;
    let tokens = new Array( ngramSize ).fill( { "index": 0, "word": "" } );
    let wordNum = -1;

    const isAlNum = ( c ) => /^[\p{L}\p{N}]*$/u.test( c );
    const iterator = fileContent[ Symbol.iterator ]();

    for ( let c = iterator.next(); !c.done; c = iterator.next(), ++index )
    {
        if ( isAlNum( c.value ) )
        {
            if ( !inToken ) // нашли новый токен
            {
                inToken = true;
                ++wordNum;
                if ( wordNum >= ngramSize ) // n-грамма полностью заполнена, сдвигаем
                {
                    tokens.shift();
                    tokens.push( { "index": index, "word": c.value.toLowerCase() } );
                }
                else                        // добавляем токен в ещё не полную n-грамму
                {
                    tokens[ wordNum ] = { "index": index, "word": c.value.toLowerCase() };
                }
            }
            else            // добавляем символ к существующему токену
            {
                tokens[ ( wordNum < ngramSize ) ? wordNum : ngramSize - 1 ].word += c.value.toLowerCase();
            }
        }
        else if ( inToken ) // токен закончился
        {
            inToken = false;
            if ( wordNum >= ngramSize - 1 )
            {
                result.push( {
                    "hash": CalculateNgramHash( tokens ),
                    "start_index": tokens[ 0 ].index,
                    "end_index": index - 1
                } );
            }
        }
    }
    if ( wordNum >= 0 && wordNum < ngramSize )  // особый случай - мало слов в файле, нужно всё равно посчитать хеш
    {
        result.push( {
            "hash": CalculateNgramHash( tokens, ngramSize ),
            "start_index": tokens[ 0 ].index,
            "end_index": index - 1
        } );
    }
    return result;
}


function ReadFile( filename )
{
    return readFileSync( filename ).toString();
}


function CheckFiles( file1, file2 )
{
    let matches = [];
    let hashesMatched = 0;
    for ( let index = 0; index < file1.data.length; ++index )
    {
        let i = 0;
        // пропуск несовпадающих хешей
        for ( ; i < file2.data.length && file1.data[ index ].hash != file2.data[ i ].hash; ++i );
        if ( i < file2.data.length )
        {
            ++hashesMatched;
            let match = {
                "matchIndex1": file1.data[ index ].start_index,
                "matchIndex2": file2.data[ i ].start_index
            };
            // поиск наиболее длинного совпадения
            while ( index + 1 < file1.data.length && i + 1 < file2.data.length
                && file1.data[ index + 1 ].hash == file2.data[ i + 1 ].hash )
            {
                ++index;
                ++i;
                ++hashesMatched;
            }
            match[ "matchLength1" ] = file1.data[ index ].end_index - match.matchIndex1 + 1;
            match[ "matchLength2" ] = file2.data[ i ].end_index - match.matchIndex2 + 1;
            matches.push( match );
        }
    }
    let result = 0;
    if ( file1.data.length > 0 )
    {
        // количество сплагиаченных n-грамм
        result = Math.ceil( 100.0 * hashesMatched / file1.data.length );
    }
    return { "file1": file1._id, "file2": file2._id, "matches": matches, "result": result };
}


export { defaultNgramSize, PreprocessFile, ReadFile, CheckFiles };
