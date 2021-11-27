# upvote-app

## Creating a List
```
$ curl \
-H "Content-Type: application/json" \
-X POST -d '{"title":"List A","details": "This is a mighty list."}' \
<INSERT URL>/v1/lists
```

## Getting a List
```
$ curl \
-X GET \
<INSERT URL>/v1/lists/<INSERT ID>
```

## Deleting a List
```
$ curl \
-X DELETE \
<INSERT URL>/v1/lists/<INSERT ID>
```