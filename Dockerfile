FROM python
ADD . /app
WORKDIR /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
EXPOSE 80
ENTRYPOINT ["python", "server.py"]