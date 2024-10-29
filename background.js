const AI_ANALYSIS_API_URL = "https://api.textrazor.com/"; // Replace with your AI API endpoint

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'analyzeContent') {
    try {
      const response = await fetch(AI_ANALYSIS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: request.content })
      });

      if (!response.ok) {
        console.error('AI analysis failed:', response.statusText);
        sendResponse({ category: 'normal' });
        return;
      }

      const result = await response.json();
      sendResponse({ category: result.category });
    } catch (error) {
      console.error('Error during AI content analysis:', error);
      sendResponse({ category: 'normal' });
    }
  }

  return true; // Required to keep the message channel open for asynchronous responses
});
