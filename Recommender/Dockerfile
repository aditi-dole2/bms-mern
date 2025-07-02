# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the dependencies from the requirements.txt file
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . .

# Expose the port that Gunicorn will listen on (typically 5000)
EXPOSE 5000

# Set the environment variable for production
ENV FLASK_ENV=production

# Use Gunicorn to run the Flask app
CMD ["gunicorn", "prdiction:app", "--bind", "0.0.0.0:5000"]
