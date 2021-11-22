# upvote-app

## Creating a List
```
$ curl \
-H "Content-Type: application/json" \
-X POST -d '{"title":"List A","details": "This is a mighty list."}' \
<INSERT URL>/v1/lists
```