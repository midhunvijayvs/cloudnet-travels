# import os
# from langchain.prompts.chat import ChatPromptTemplate
# from langchain_openai import ChatOpenAI, OpenAIEmbeddings
# from langchain_community.vectorstores import FAISS
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_schema.runnable import RunnablePassthrough

# # ✅ Set your OpenAI API key
# os.environ["OPENAI_API_KEY"] = "your_openai_api_key_here"

# # 📄 Example documents
# texts = [
#     "You can cancel or reschedule flights up to 24 hours before departure.",
#     "Refunds take 5-7 business days depending on your payment method.",
#     "Cloudnet Travels provides 24/7 customer support."
# ]

# # 🧩 Step 1: Split text into chunks
# splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
# docs = splitter.create_documents(texts)

# # 🧠 Step 2: Create embeddings + vector store
# embeddings = OpenAIEmbeddings()
# vectorstore = FAISS.from_documents(docs, embeddings)

# # 🔍 Step 3: Create retriever
# retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# # 💬 Step 4: Prompt template
# prompt = ChatPromptTemplate.from_template("""
# Answer the question using the context below.
# If you don’t know, say “I don’t know”.

# Context:
# {context}

# Question:
# {question}
# """)

# # 🤖 Step 5: LLM (you can use "gpt-4o-mini" or "gpt-3.5-turbo")
# llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# # 🔗 Step 6: LCEL RAG pipeline
# rag_chain = (
#     {
#         "context": retriever | (lambda docs: "\n\n".join([d.page_content for d in docs])),
#         "question": RunnablePassthrough()
#     }
#     | prompt
#     | llm
# )

# # 🚀 Step 7: Ask a question
# response = rag_chain.invoke("How can I cancel my flight?")
# print(response.content)
  