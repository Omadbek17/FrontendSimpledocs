import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DocumentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.document_id = self.scope['url_route']['kwargs']['document_id']
            self.room_group_name = f'document_{self.document_id}'
            print(f"[WS] Client connecting to doc: {self.document_id}")

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
            print(f"[WS] Connected to room: {self.room_group_name}")

            await self.send(text_data=json.dumps({
                "message": f"Connected to document {self.document_id}"
            }))
        except Exception as e:
            print(f"[WS ERROR] connect(): {e}")
            await self.close(code=1011)

    async def disconnect(self, close_code):
        print(f"[WS] Disconnecting from {self.room_group_name} (code {close_code})")
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print(f"[WS ERROR] disconnect(): {e}")

    async def receive(self, text_data):
        print(f"[WS] Received: {text_data}")
        try:
            data = json.loads(text_data)
            content = data.get("content", "")
            username = self.scope["user"].username if self.scope["user"].is_authenticated else "Anonymous"

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send_update",
                    "content": content,
                    "username": username,
                }
            )
            print(f"[WS] Broadcasted content: {content}")
        except Exception as e:
            print(f"[WS ERROR] receive(): {e}")
            await self.send(text_data=json.dumps({
                "error": "Invalid message format."
            }))

    async def send_update(self, event):
        print(f"[WS] send_update triggered: {event}")
        try:
            await self.send(text_data=json.dumps({
                "content": event["content"],
                "username": event.get("username", "")
            }))
        except Exception as e:
            print(f"[WS ERROR] send_update(): {e}")
            await self.close(code=1011)
