# Start from a slim Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# install gunicorn
RUN pip install gunicorn

# Copy and install requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port Gunicorn will run on
EXPOSE 5000

# Run the app with Gunicorn
# This assumes your Flask app instance is named 'app'
# in a file named 'app.py' (i.e., app:app)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]