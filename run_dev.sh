#!/bin/bash
export ENVIRONMENT=development
# python db_check.py
# uvicorn api.main:app --reload
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload 
