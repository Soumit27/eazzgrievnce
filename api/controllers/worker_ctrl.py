from api.db.models.complaint import Worker
from api.db.models.user import User
from fastapi import HTTPException
from typing import List, Dict
from datetime import datetime

def worker_to_dict(worker: Worker, active_tasks: int = 0) -> dict:
    return {
        "id": str(worker.id),
        "full_name": worker.full_name,
        "role": worker.role,
        "available": True,  # always true, no max limit
        "active_tasks": active_tasks,
        "last_assigned_at": worker.last_assigned_at.isoformat() if worker.last_assigned_at else None,
        "created_at": worker.created_at.isoformat() if worker.created_at else None,
    }


async def create_worker_controller(full_name: str, role: str) -> Dict:
    try:
        worker = Worker(
            full_name=full_name,
            role=role,
            available=True,
        )
        saved = await worker.insert()
        return worker_to_dict(saved)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create worker: {str(e)}")

async def get_workers_controller() -> List[Dict]:
    try:
        workers = await Worker.find_all().to_list()
        return [worker_to_dict(w) for w in workers]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch workers: {str(e)}")

