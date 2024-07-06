# Galadriel RAG Tools

This repository contains a containerized implementation of the Galadriel Retrieval-Augmented Generation (RAG) process, along with a frontend for easy usage.

## Overview

Galadriel RAG Tools implements a Retrieval-Augmented Generation system, which enhances LLM responses by retrieving relevant information from a custom knowledge base. This implementation includes:

- Document ingestion and processing
- Knowledge base indexing
- Integration with Galadriel oracle for secure, off-chain processing
- A user-friendly frontend for easy interaction

## Prerequisites

- Docker and Docker Compose
- Node.js and yarn
- Python v3.11
- A Galadriel devnet account and some devnet tokens
- An API key (JWT) from pinata.cloud for IPFS document uploading

## Repository Structure

- `backend/`: Contains the Docker setup for the RAG tools backend
- `frontend/`: Contains the React-based frontend application

## Setup and Installation

### Backend

- Navigate to the `rag_tools` directory
- Copy the template environment file:
```sh
cp template.env .env
```
- Run the following command to build and start the backend services:

```sh
docker-compose up --build
```

### Frontend

-  Navigate to the `frontend` directory
- Copy the template environment file:

```sh
cp template.env .env.local
```

- Edit `.env.local` and set the necessary environment variables
- Install dependencies:
```sh
yarn install
```
- Start the development server:
```sh
yarn run dev
```

## Current Limitations

- The system currently supports single file upload for knowledge base processing and indexing. Future updates will include support for multiple file uploads.

## Contributing

Contributions to improve the Galadriel RAG Tools are welcome. Please feel free to submit issues and pull requests.

## Acknowledgements

This project is based on the Galadriel [RAG tutorial](https://docs.galadriel.com/tutorials/rag) and uses the Galadriel oracle for secure, off-chain processing.