# Summary Generation Timeout Fix

## Problem
The summary generation endpoint was timing out after 300000ms (5 minutes) with the error:
```
Failed to generate summary: timeout of 300000ms exceeded
```

This occurred because summary generation is a CPU-intensive operation that:
1. Loads a large BART model (~1.6GB)
2. Generates 3 separate summaries (short, medium, detailed) sequentially
3. For long transcripts (>700 words), processes chunks and merges results
4. All operations happen synchronously, blocking the HTTP response

## Solution
Converted summary generation to use **FastAPI BackgroundTasks**, allowing the endpoint to:
1. Return immediately with HTTP 202 Accepted status
2. Process summary generation asynchronously in the background
3. Update the database when complete
4. Allow the frontend to poll for results

## Changes Made

### Backend Changes

#### 1. `backend/app/routers/summary_router.py`
- Added `BackgroundTasks` import from FastAPI
- Created `_generate_summary_background()` function to handle summary generation
- Modified `/generate` endpoint to:
  - Set video status to "processing_summary"
  - Add background task instead of processing synchronously
  - Return HTTP 202 Accepted with informative message
  - Background task creates its own database session

**Key improvements:**
- No timeout issues - endpoint returns immediately
- Proper database session management for background tasks
- Error handling and logging in background process
- Video status updated to track processing state

### Frontend Changes

#### 2. `frontend/src/pages/VideoDetail.jsx`
- Updated `handleGenerateSummary()` to handle async response
- Shows user-friendly message about background processing
- Automatically refreshes data after 3 seconds
- Maintains loading state during initiation

**User experience:**
- Immediate feedback that generation started
- Clear message about processing time
- Automatic refresh to show updated status

## How It Works

### Request Flow
```
1. User clicks "Generate Summary"
   ↓
2. Frontend calls POST /api/videos/{id}/summary/generate
   ↓
3. Backend:
   - Validates request
   - Sets video.status = "processing_summary"
   - Adds task to BackgroundTasks
   - Returns 202 Accepted immediately
   ↓
4. Frontend receives 202, shows message, refreshes in 3s
   ↓
5. Background task processes summary (no timeout)
   ↓
6. Background task saves to database
   ↓
7. Frontend refresh shows completed summary
```

### Database Session Management
The background task creates a new database session because:
- FastAPI's dependency injection session is not available in background tasks
- Prevents session conflicts and connection leaks
- Ensures proper cleanup with try/finally block

## Testing

### Manual Testing
1. Upload a video with a long transcript (>5 minutes)
2. Click "Generate Summary"
3. Verify immediate response (no timeout)
4. Wait 2-3 minutes for processing
5. Refresh page to see completed summary

### Automated Testing
Run the test script:
```bash
cd backend
python test_summary_async.py
```

This tests:
- Direct summary service functionality
- Background task function execution
- Database operations

## Benefits

1. **No Timeouts**: Endpoint returns immediately, processing happens in background
2. **Better UX**: Users get immediate feedback instead of waiting
3. **Scalable**: Multiple summaries can be processed concurrently
4. **Reliable**: Proper error handling and logging in background tasks
5. **Status Tracking**: Video status shows "processing_summary" during generation

## Monitoring

Check backend logs for summary generation progress:
```
INFO: Background: Generating summary for video 123
INFO: Background: Generating short summary...
INFO: Background: Generating medium summary...
INFO: Background: Generating detailed summary...
INFO: Background: Saving summary...
INFO: Background: Summary generation completed for video 123
```

## Notes

- The 5-minute frontend timeout remains unchanged (still needed for other operations)
- Summary generation time depends on transcript length:
  - Short (<500 words): ~30-60 seconds
  - Medium (500-1000 words): ~1-2 minutes
  - Long (>1000 words): ~2-4 minutes
- Model is loaded once and cached (first generation takes longer)
- Subsequent summaries use cached model (faster)

## Future Improvements

1. Add WebSocket support for real-time progress updates
2. Implement progress tracking in database
3. Add email notification when summary is ready
4. Queue system for multiple concurrent requests
5. Model warmup on application startup