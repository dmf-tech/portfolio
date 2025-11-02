/**
 * AI Scraping Protection System
 * Prevents AI tools from easily copying website structure and design
 */

(function() {
    'use strict';
    
    // === Bot Detection ===
    const detectBot = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Whitelist legitimate search engine bots
        const allowedBots = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'sogou'];
        const isAllowedBot = allowedBots.some(bot => userAgent.includes(bot));
        if (isAllowedBot) {
            return false; // Allow legitimate search engines
        }
        
        // AI and scraping bot patterns (excluding 'bot' to avoid false positives)
        const aiBotPatterns = [
            'openai',
            'anthropic',
            'claude',
            'chatgpt',
            'gpt-',
            'gptbot',
            'perplexity',
            'ccbot',
            'anthropic-ai',
            'claude-web',
            'scrape',
            'scraper',
            'headless',
            'phantom',
            'selenium',
            'puppeteer',
            'playwright',
            'automation',
            'webdriver',
            'crawler',
            'spider',
            'curl',
            'wget',
            'http'
        ];

        // Check user agent
        const isBot = aiBotPatterns.some(pattern => userAgent.includes(pattern));
        
        // Check for headless browser indicators (more strict criteria)
        const isHeadless = (
            navigator.webdriver === true ||
            (window.outerHeight === 0 && window.outerWidth === 0) ||
            (navigator.plugins.length === 0 && navigator.mimeTypes.length === 0)
        ) && (
            userAgent.includes('headless') || 
            userAgent.includes('phantom') ||
            userAgent.includes('selenium')
        );

        // Check for automation tools (only specific automation indicators)
        const hasAutomation = (
            window.navigator.webdriver === true ||
            window.callPhantom ||
            window._phantom ||
            window.__nightmare ||
            (window.Buffer && !window.Buffer.isBuffer) // Node.js Buffer in browser = suspicious
        ) && (
            userAgent.includes('automation') ||
            userAgent.includes('selenium') ||
            userAgent.includes('webdriver')
        );

        return isBot || isHeadless || hasAutomation;
    };

    // === Anti-Debugging ===
    const antiDebug = () => {
        // Only disable non-critical console methods (keep error/warn for debugging)
        // This prevents casual inspection but allows error logging to work
        const noop = () => {};
        const methodsToDisable = ['log', 'debug', 'info', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'trace'];
        
        methodsToDisable.forEach(method => {
            if (console[method] && typeof console[method] === 'function') {
                try {
                    console[method] = noop;
                } catch (e) {
                    // Silently fail if console method can't be overridden
                }
            }
        });

        // Disable DevTools shortcuts
        document.addEventListener('keydown', (e) => {
            // Disable F12
            if (e.keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Disable Ctrl+Shift+I (Chrome DevTools)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Disable Ctrl+Shift+J (Chrome Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Disable Ctrl+Shift+C (Chrome Inspector)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        // Detect DevTools opening (less aggressive - just clear console)
        let devtools = {open: false, orientation: null};
        const threshold = 160;
        setInterval(() => {
            if (!document.body) {
                return;
            }
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    // Show warning but don't break console for error logging
                    try {
                        // Only clear if console.clear exists and wasn't disabled
                        if (console.clear && typeof console.clear === 'function' && console.clear.toString().includes('noop') === false) {
                            console.clear();
                        }
                        // Try to log warning, but don't break if console.log was disabled
                        if (typeof console.warn === 'function') {
                            console.warn('%cAccess Restricted', 'color: red; font-size: 50px; font-weight: bold;');
                        }
                    } catch (e) {
                        // Silently fail if console operations fail
                    }
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    };

    // === DOM Structure Obfuscation ===
    const obfuscateDOM = () => {
        if (!document.body) {
            return;
        }

        // Add random data attributes to confuse scrapers (limit to avoid performance issues)
        const randomAttr = () => Math.random().toString(36).substring(2, 9);
        const elements = document.querySelectorAll('body > *'); // Only direct children of body
        
        // Limit obfuscation to avoid breaking functionality
        const maxElements = 50;
        const limitedElements = Array.from(elements).slice(0, maxElements);
        
        limitedElements.forEach((el, index) => {
            // Add noise data attributes (will be cleaned by cloneNode override)
            if (index % 5 === 0) {
                const noiseKey = `data-n${randomAttr()}`;
                const noiseValue = randomAttr();
                el.setAttribute(noiseKey, noiseValue);
            }
        });
    };

    // === Disable Common Scraping Methods ===
    const disableScraping = () => {
        // Note: We don't override innerHTML as it would break the website's functionality
        // The website legitimately uses innerHTML for dynamic content
        // Instead, we rely on other protections like text selection and right-click blocking

        // Lightly obfuscate cloning - remove noise attributes but preserve functionality
        const originalCloneNode = Node.prototype.cloneNode;
        Node.prototype.cloneNode = function(deep) {
            const clone = originalCloneNode.call(this, deep);
            // Only remove noise data attributes we added, not legitimate ones
            if (clone.hasAttributes && clone.hasAttributes()) {
                try {
                    Array.from(clone.attributes).forEach(attr => {
                        // Only remove noise attributes (ones we added starting with 'data-n')
                        if (attr.name.startsWith('data-n') && attr.name.length < 15) {
                            clone.removeAttribute(attr.name);
                        }
                    });
                } catch (e) {
                    // If attribute manipulation fails, return clone as-is
                }
            }
            return clone;
        };

        // Note: We don't override outerHTML as it's commonly used by legitimate code
        // and would break functionality. The other protections are sufficient.
    };

    // === Rate Limiting for DOM Access ===
    // Monitor DOM access but don't break normal operations
    let domAccessCount = 0;
    let suspiciousAccessCount = 0;
    const domAccessWarningThreshold = 5000; // Warn at 5000 queries per second (very high)
    const domAccessBlockThreshold = 10000; // Block at 10000 (only for obvious scrapers)
    const originalQuerySelector = Document.prototype.querySelector;
    const originalQuerySelectorAll = Document.prototype.querySelectorAll;
    
    // Reset counters every second
    setInterval(() => {
        if (domAccessCount > domAccessWarningThreshold) {
            suspiciousAccessCount++;
        } else {
            suspiciousAccessCount = Math.max(0, suspiciousAccessCount - 1);
        }
        domAccessCount = 0;
    }, 1000);
    
    // Only interfere if extremely high rate (indicates scraping)
    Document.prototype.querySelector = function(...args) {
        domAccessCount++;
        // Only block if access is extremely excessive AND pattern is suspicious
        if (domAccessCount > domAccessBlockThreshold && suspiciousAccessCount > 3) {
            return null; // Block only obvious scrapers
        }
        return originalQuerySelector.apply(this, args);
    };
    
    Document.prototype.querySelectorAll = function(...args) {
        domAccessCount++;
        // Only block if access is extremely excessive AND pattern is suspicious
        if (domAccessCount > domAccessBlockThreshold && suspiciousAccessCount > 3) {
            return document.createDocumentFragment(); // Return empty fragment
        }
        return originalQuerySelectorAll.apply(this, args);
    };

    // === Initialize Protection ===
    const initProtection = () => {
        // Wait for body to exist
        if (!document.body) {
            setTimeout(initProtection, 100);
            return;
        }

        // Check if bot is detected
        if (detectBot()) {
            // Show minimal content or redirect only for confirmed bots
            const botWarning = document.createElement('div');
            botWarning.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;background:#fff;position:fixed;top:0;left:0;width:100%;z-index:999999;';
            botWarning.innerHTML = '<div style="text-align:center;"><h1 style="color:#333;margin-bottom:20px;">Automated Access Detected</h1><p style="color:#666;">This content is protected from automated scraping.</p></div>';
            document.body.appendChild(botWarning);
            return;
        }

        // Apply protection measures (always active)
        antiDebug();
        disableScraping();
        
        // Apply DOM obfuscation after page load
        if (document.readyState === 'complete') {
            obfuscateDOM();
        } else {
            window.addEventListener('load', obfuscateDOM);
        }
    };

    // Start protection immediately - wait for body to exist
    const startProtection = () => {
        if (!document.body) {
            setTimeout(startProtection, 50);
            return;
        }
        // Initialize protection (always active)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProtection);
        } else {
            initProtection();
        }
    };
    
    startProtection();

    // Re-check periodically for new bot attempts
    setInterval(() => {
        if (document.body && detectBot()) {
            // Only show warning if bot is detected and no warning already exists
            if (!document.querySelector('.bot-warning-overlay')) {
                const botWarning = document.createElement('div');
                botWarning.className = 'bot-warning-overlay';
                botWarning.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;background:#fff;position:fixed;top:0;left:0;width:100%;z-index:999999;';
                botWarning.innerHTML = '<div style="text-align:center;"><h1 style="color:#333;margin-bottom:20px;">Automated Access Detected</h1><p style="color:#666;">This content is protected from automated scraping.</p></div>';
                document.body.appendChild(botWarning);
            }
        }
    }, 5000);

})();

