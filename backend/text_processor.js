import { readFileSync } from "node:fs";

function CalculateStringHash( str )
{
    let hash = 0;
    if ( str.length === 0 )
    {
        return hash;
    }
    for ( let i = 0; i < str.length; i++ )
    {
        chr = str.charCodeAt( i );
        hash = ( ( hash << 5 ) - hash ) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
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
    let tokens = new Array( ngramSize ).fill( "" );
    let wordNum = -1;

    const isAlNum = ( c ) => /^[\p{L}\p{N}]*$/u.test( c );
    const iterator = fileContent[ Symbol.iterator ]();

    for ( let c = iterator.next(); !c.done; c = iterator.next(), ++index )
    {
        if ( isAlNum( c ) )
        {
            if ( !inToken ) // нашли новый токен
            {
                inToken = true;
                ++wordNum;
                if ( wordNum >= ngramSize ) // n-грамма полностью заполнена, сдвигаем
                {
                    tokens.shift();
                    tokens.push( { "index": index, "word": c } );
                }
                else                        // добавляем токен в ещё не полную n-грамму
                {
                    tokens[ wordNum ] = { "index": index, "word": c };
                }
            }
            else            // добавляем символ к существующему токену
            {
                tokens[ ( wordNum < ngramSize ) ? wordNum : ngramSize - 1 ].word += c;
            }
        }
        else if ( inToken ) // токен закончился
        {
            inToken = false;
            if ( wordNum >= ngramSize - 1 )
            {
                result.push( {
                    "hash": CalculateNgramHash( tokens ),
                    "text_index": tokens[ 0 ].index
                } );
            }
        }
    }
    if ( wordNum >= 0 && wordNum < ngramSize )  // особый случай - мало слов в файле, нужно всё равно посчитать хеш
    {
        result.push( {
            "hash": CalculateNgramHash( tokens, ngramSize ),
            "text_index": tokens[ 0 ].index
        } );
    }
    return result;
}


function ReadFile( filename )
{
    return readFileSync( filename ).toString();
}


export { PreprocessFile, ReadFile };
