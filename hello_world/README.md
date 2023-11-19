# Проверка работы с базой данных

Скрипт для проверки работы с базой данных. Для запуска нужно из корневой папки проекта вызвать:

```
docker-compose run --service-ports backend hello_world
./hello_world/request.sh [...]
```

Данный скрипт обеспечивает минимальный CRUD в базе данных `test`.
Информация добавляется в коллекцию `users`. Поля, которые содержатся в хранимых объектах: `name`, `age`.

## Параметры скрипта

* `request.sh get [id]` - вывести записи в коллекции. Если указан id, то выводится запись с данным id, иначе - все записи.
* `request.sh post JSON` - добавить элемент, рекомендуется, чтобы в json были поля `name` и `age`.
* `request.sh put JSON` - обновить существующий элемент, рекомендуется, чтобы в json были поля `name` и `age`. *Должно* быть поле `id`.
* `request.sh delete id` - удалить элемент по id.

## Примеры запросов

```
./hello_world/request.sh post '{"name": "Tyler Durden", "age": 27}'
./hello_world/request.sh post '{"name": "Robert Paulson", "age": 40}'
./hello_world/request.sh get
./hello_world/request.sh get 651312f74ee333774e0b9997
./hello_world/request.sh delete 651312f74ee333774e0b9997
./hello_world/request.sh put '{"name": "Patrick Bateman", "age": 27, "id": "651319d532c4714a115d745b"}'
```

