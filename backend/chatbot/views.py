from rest_framework.views import APIView
from rest_framework.response import Response
from .rag_engine import rag_chain

class ChatBotAPIView(APIView):
    """Handles POST requests from frontend chat."""

    def post(self, request):
        question = request.data.get("question", "").strip()

        if not question:
            return Response({"error": "No question provided"}, status=400)

        try:
            answer = rag_chain.invoke(question)
            return Response({"answer": answer})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
