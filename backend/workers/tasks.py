"""
Asynchronous AI processing tasks for issue analysis and triage
Enhanced with better error handling and logging
Updated to use Firestore database instead of PostgreSQL
"""
import asyncio
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime

try:
    from celery import current_task
    from workers.celery_app import celery_app
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False
    print("⚠️  Celery not available - background tasks will run synchronously")

from core.firestore_db import update_issue, get_issue, get_issues

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Placeholder AI service functions - these would be replaced with actual AI service calls
async def call_llava_service(image_url: str) -> Dict[str, Any]:
    """
    Placeholder function for LLaVA vision AI service
    
    Args:
        image_url: URL of the image to analyze
        
    Returns:
        Dict containing image analysis results
    """
    logger.info(f"🔍 Analyzing image: {image_url}")
    
    # Simulate AI processing time
    await asyncio.sleep(2)
    
    # Mock response - would be replaced with actual LLaVA API call
    return {
        "description": "Image shows a damaged road with potholes and broken pavement",
        "objects_detected": ["road", "pothole", "asphalt", "damage"],
        "severity_indicators": ["cracks", "holes", "surface_damage"],
        "confidence_score": 0.92,
        "suggested_category": "Public Works",
        "safety_concerns": ["vehicle_damage_risk", "pedestrian_hazard"]
    }

async def call_analysis_agent(text_input: str, image_summary: str, audio_transcript: Optional[str] = None) -> Dict[str, Any]:
    """
    Placeholder function for analysis AI agent
    
    Args:
        text_input: User's description of the issue
        image_summary: Summary from image analysis
        audio_transcript: Transcribed audio if available
        
    Returns:
        Dict containing consolidated analysis
    """
    logger.info("🤖 Running analysis agent")
    
    # Simulate AI processing time
    await asyncio.sleep(3)
    
    # Build context for analysis
    full_context = f"User description: {text_input}\nImage analysis: {image_summary}"
    if audio_transcript:
        full_context += f"\nAudio transcript: {audio_transcript}"
    
    # Mock response - would be replaced with actual LLM API call
    return {
        "ai_summary": (
            "This issue involves infrastructure damage requiring immediate attention. "
            "Based on visual evidence and user description, this appears to be a road maintenance issue "
            "that could pose safety risks to vehicles and pedestrians."
        ),
        "key_points": [
            "Road surface damage identified",
            "Safety hazard for vehicles",
            "Requires municipal attention",
            "Located in high-traffic area"
        ],
        "urgency_indicators": ["safety_risk", "infrastructure_damage", "public_area"],
        "affected_stakeholders": ["motorists", "pedestrians", "local_residents"],
        "estimated_impact": "medium_to_high"
    }

async def call_triage_agent(analysis_result: Dict[str, Any], user_description: str, location_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Placeholder function for triage AI agent
    
    Args:
        analysis_result: Result from analysis agent
        user_description: Original user description
        location_data: Location information
        
    Returns:
        Dict containing priority and category assignments
    """
    logger.info("⚖️  Running triage agent")
    
    # Simulate AI processing time
    await asyncio.sleep(2)
    
    # Mock response - would be replaced with actual LLM API call
    return {
        "priority": "High",
        "category": "Public Works",
        "reasoning": "Road infrastructure damage poses immediate safety risks and requires municipal intervention",
        "estimated_resolution_time": "7-14 days",
        "required_departments": ["Public Works", "Traffic Management"],
        "budget_estimate": "medium",
        "public_impact_score": 7.5,
        "triage_confidence": 0.89
    }

# Main processing function (works with or without Celery)
async def process_new_issue_async(issue_id: str) -> Dict[str, Any]:
    """
    Process a new issue through the AI pipeline
    This function can be called directly or through Celery
    
    Args:
        issue_id: ID of the issue to process
        
    Returns:
        Dict with processing results
    """
    return await _process_issue_async(issue_id)

# Celery task wrapper (if Celery is available)
if CELERY_AVAILABLE:
    @celery_app.task(bind=True, name="workers.tasks.process_new_issue")
    def process_new_issue(self, issue_id: str):
        """
        Celery task to process a new issue through the AI pipeline
        
        Args:
            issue_id: ID of the issue to process
        """
        try:
            # Use asyncio to run async functions
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(_process_issue_async(issue_id))
            loop.close()
            return result
        except Exception as e:
            logger.error(f"❌ Error processing issue {issue_id}: {str(e)}")
            # Update issue status to error
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(_update_issue_status(issue_id, "error", str(e)))
            loop.close()
            raise
else:
    # Fallback function when Celery is not available
    def process_new_issue(issue_id: str):
        """
        Synchronous wrapper for issue processing when Celery is not available
        
        Args:
            issue_id: ID of the issue to process
        """
        logger.warning("⚠️  Running background task synchronously (Celery not available)")
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(_process_issue_async(issue_id))
            loop.close()
            return result
        except Exception as e:
            logger.error(f"❌ Error processing issue {issue_id}: {str(e)}")
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(_update_issue_status(issue_id, "error", str(e)))
            loop.close()
            raise

async def _process_issue_async(issue_id: str) -> Dict[str, Any]:
    """
    Async function to process issue through AI pipeline
    """
    logger.info(f"Starting AI processing for issue {issue_id}")
    
    try:
        # Step 1: Get issue data from database
        issue_data = await _get_issue_data(issue_id)
        if not issue_data:
            raise ValueError(f"Issue {issue_id} not found")
        
        logger.info(f"Retrieved issue data for {issue_id}")
        
        # Step 2: Update status to processing
        await _update_issue_status(issue_id, "processing")
        
        # Step 3: Process image with LLaVA (Agent 1 - Vision)
        image_analysis = None
        if issue_data.get("image_url"):
            logger.info(f"Processing image for issue {issue_id}")
            image_analysis = await call_llava_service(issue_data["image_url"])
            logger.info(f"Image analysis completed for issue {issue_id}")
        
        # Step 4: Consolidate with Analysis Agent (Agent 2 - Analysis)
        logger.info(f"Running analysis agent for issue {issue_id}")
        analysis_result = await call_analysis_agent(
            text_input=issue_data["description"],
            image_summary=json.dumps(image_analysis) if image_analysis else "",
            audio_transcript=None  # Would process audio if available
        )
        logger.info(f"Analysis completed for issue {issue_id}")
        
        # Step 5: Run Triage Agent (Agent 3 - Triage)
        logger.info(f"Running triage agent for issue {issue_id}")
        triage_result = await call_triage_agent(
            analysis_result=analysis_result,
            user_description=issue_data["description"],
            location_data={
                "latitude": issue_data.get("latitude"),
                "longitude": issue_data.get("longitude"),
                "address": issue_data.get("location_address")
            }
        )
        logger.info(f"Triage completed for issue {issue_id}")
        
        # Step 6: Update issue with AI results
        await _update_issue_with_ai_results(
            issue_id=issue_id,
            ai_summary=analysis_result["ai_summary"],
            priority=triage_result["priority"],
            category=triage_result["category"]
        )
        
        logger.info(f"Successfully processed issue {issue_id}")
        
        return {
            "issue_id": issue_id,
            "status": "completed",
            "ai_summary": analysis_result["ai_summary"],
            "priority": triage_result["priority"],
            "category": triage_result["category"],
            "processing_time": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in AI processing for issue {issue_id}: {str(e)}")
        await _update_issue_status(issue_id, "error", str(e))
        raise

async def _get_issue_data(issue_id: str) -> Optional[Dict[str, Any]]:
    """Get issue data from Firestore"""
    try:
        issue = await get_issue(issue_id)
        if issue:
            # Convert Firestore document to expected format
            return {
                "issue_id": issue.get("id"),
                "title": issue.get("title"),
                "description": issue.get("description"),
                "image_url": issue.get("imageUrl"),
                "audio_url": issue.get("audioUrl"),
                "longitude": issue.get("longitude"),
                "latitude": issue.get("latitude"),
                "location_address": issue.get("locationAddress"),
                "category": issue.get("category"),
                "priority": issue.get("priority")
            }
        return None
    except Exception as e:
        logger.error(f"Error fetching issue data for {issue_id}: {str(e)}")
        return None

async def _update_issue_status(issue_id: str, processing_status: str, error_message: str = None):
    """Update issue processing status in Firestore"""
    try:
        # Update issue with processing status
        update_data = {
            "processingStatus": processing_status,
            "updatedAt": datetime.utcnow().isoformat()
        }
        
        await update_issue(issue_id, update_data)
        
        if error_message:
            # Log error details
            logger.error(f"Issue {issue_id} processing error: {error_message}")
            
    except Exception as e:
        logger.error(f"Error updating issue status for {issue_id}: {str(e)}")

async def _update_issue_with_ai_results(
    issue_id: str, 
    ai_summary: str, 
    priority: str, 
    category: str
):
    """Update issue with AI processing results in Firestore"""
    try:
        update_data = {
            "aiSummary": ai_summary,
            "priority": priority,
            "category": category,
            "processingStatus": "triaged",
            "updatedAt": datetime.utcnow().isoformat()
        }
        
        await update_issue(issue_id, update_data)
        logger.info(f"Updated issue {issue_id} with AI results")
        
    except Exception as e:
        logger.error(f"Error updating issue {issue_id} with AI results: {str(e)}")
        raise

# Additional utility tasks

@celery_app.task(name="workers.tasks.reprocess_failed_issues")
def reprocess_failed_issues():
    """
    Task to reprocess issues that failed AI processing
    """
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(_reprocess_failed_issues_async())
        loop.close()
        return result
    except Exception as e:
        logger.error(f"Error reprocessing failed issues: {str(e)}")
        raise

async def _reprocess_failed_issues_async():
    """Find and reprocess failed issues using Firestore"""
    try:
        # Get all issues from Firestore
        all_issues = await get_issues()
        
        # Filter for failed issues that are older than 1 hour
        current_time = datetime.utcnow()
        failed_issues = []
        
        for issue in all_issues:
            if issue.get("processingStatus") == "error":
                # Check if updated_at is older than 1 hour
                updated_at_str = issue.get("updatedAt")
                if updated_at_str:
                    try:
                        updated_at = datetime.fromisoformat(updated_at_str.replace('Z', '+00:00'))
                        if (current_time - updated_at.replace(tzinfo=None)).total_seconds() > 3600:  # 1 hour
                            failed_issues.append(issue["id"])
                    except (ValueError, TypeError):
                        continue
                        
        # Limit to 10 issues for reprocessing
        failed_issues = failed_issues[:10]
        
        results = []
        for issue_id in failed_issues:
            try:
                # Reset status and reprocess
                await _update_issue_status(issue_id, "pending")
                # Queue for reprocessing
                if CELERY_AVAILABLE:
                    process_new_issue.delay(issue_id)
                else:
                    # Run synchronously if Celery not available
                    await process_new_issue_async(issue_id)
                results.append({"issue_id": issue_id, "status": "requeued"})
            except Exception as e:
                results.append({"issue_id": issue_id, "status": "failed", "error": str(e)})
        
        return {"reprocessed_count": len(results), "results": results}
        
    except Exception as e:
        logger.error(f"Error in reprocess failed issues: {str(e)}")
        raise

# Periodic cleanup task
@celery_app.task(name="workers.tasks.cleanup_old_processing_records")
def cleanup_old_processing_records():
    """
    Clean up old processing records and logs
    """
    logger.info("Running cleanup of old processing records")
    # Implementation would clean up old task results, logs, etc.
    return {"status": "completed", "cleaned_records": 0}