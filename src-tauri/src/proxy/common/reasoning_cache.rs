// Reasoning Cache for Gemini Extended Thinking
// Caches thinking block signatures associated with tool call IDs
// to resolve issue #65: 400 error on second conversation

use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;

/// Cache entry containing thinking signature
#[derive(Debug, Clone)]
pub struct ThinkingContext {
    pub signature: String,
    pub thinking_content: String,
}

/// Global reasoning cache (in-memory only for now)
static REASONING_CACHE: Lazy<Mutex<HashMap<String, ThinkingContext>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

/// Store thinking context for a tool call ID
pub fn cache_thinking_for_tool(tool_id: &str, thinking: String, signature: String) {
    let context = ThinkingContext {
        signature,
        thinking_content: thinking,
    };

    if let Ok(mut cache) = REASONING_CACHE.lock() {
        cache.insert(tool_id.to_string(), context);
    }
}

/// Retrieve cached thinking signature for a tool call ID
pub fn get_thinking_signature(tool_id: &str) -> Option<String> {
    if let Ok(cache) = REASONING_CACHE.lock() {
        cache.get(tool_id).map(|ctx| ctx.signature.clone())
    } else {
        None
    }
}

/// Clear the entire cache (useful for testing)
#[allow(dead_code)]
pub fn clear_cache() {
    if let Ok(mut cache) = REASONING_CACHE.lock() {
        cache.clear();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cache_and_retrieve() {
        clear_cache();

        cache_thinking_for_tool(
            "tool_123",
            "Let me think about this...".to_string(),
            "sig_abc".to_string()
        );

        let sig = get_thinking_signature("tool_123");
        assert_eq!(sig, Some("sig_abc".to_string()));
    }

    #[test]
    fn test_missing_entry() {
        clear_cache();
        let sig = get_thinking_signature("nonexistent");
        assert_eq!(sig, None);
    }
}
