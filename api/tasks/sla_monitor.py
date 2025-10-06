# api/tasks/sla_monitor.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime
from api.db.models.complaint import Complaint, AssignmentStatus, ComplaintStatus
from api.db.models.complaint import Worker
from bson import ObjectId

async def handle_sla_breach(complaint, assignment, idx):
    # simple policy: mark assignment escalated and free worker; notify AM
    assignment.status = AssignmentStatus.ESCALATED
    assignment.escalate_reason = "SLA breached"
    # free worker if exists
    if assignment.worker_id:
        try:
            w = await Worker.get(ObjectId(assignment.worker_id))
            if w:
                w.available = True
                await w.save()
        except Exception:
            pass
    complaint.status = ComplaintStatus.ESCALATED
    complaint.updated_at = datetime.utcnow()
    await complaint.save()
    # placeholder: notify AM for manual reassign or auto-assign contractor
    # await notify_ams_sla_breach(complaint, assignment)

async def check_sla():
    now = datetime.utcnow()
    complaints = await Complaint.find_all().to_list()  # simple; optimize as needed
    for c in complaints:
        idx = c.current_assignment_index
        if idx is None or not c.assignments:
            continue
        if idx >= len(c.assignments):
            continue
        assignment = c.assignments[idx]
        if assignment.status == AssignmentStatus.ASSIGNED and assignment.sla_deadline and assignment.sla_deadline < now:
            await handle_sla_breach(c, assignment, idx)

def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(lambda: __import__('asyncio').get_event_loop().create_task(check_sla()), "interval", minutes=1)
    scheduler.start()
