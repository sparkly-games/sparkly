// Poki SDK Stub (null.js replacement)
(function() {
    'use strict';
    
    // Create global PokiSDK object
    window.PokiSDK = {
        // SDK initialization
        init: function() {
            return Promise.resolve();
        },
        
        // Gameplay state tracking
        gameplayStart: function() {
            console.log('PokiSDK: gameplayStart');
        },
        
        gameplayStop: function() {
            console.log('PokiSDK: gameplayStop');
        },
        
        // Rewarded ads
        rewardedBreak: function() {
            return Promise.resolve({ 
                completed: true,
                adFinished: true
            });
        },
        
        // Commercial break
        commercialBreak: function() {
            return Promise.resolve();
        },
        
        // Happy time
        happyTime: function(intensity) {
            console.log('PokiSDK: happyTime with intensity', intensity);
            return Promise.resolve();
        },
        
        // Custom event tracking
        customEvent: function(eventName, data) {
            console.log('PokiSDK: customEvent', eventName, data);
        },
        
        // SDK info
        getSDKVersion: function() {
            return '3.0.0-stub';
        },
        
        // Player info
        getPlayer: function() {
            return Promise.resolve({
                age: 13,
                isChild: false,
                isUnderAge: false,
                data: {}
            });
        },
        
        // URL utilities
        getURL: function() {
            return window.location.href;
        },
        
        // Navigation
        navigateToPoki: function() {
            window.location.href = 'https://poki.com';
            return Promise.resolve();
        },
        
        // Share functionality
        share: function(options) {
            return Promise.resolve(true);
        },
        
        // Debug mode
        debug: function(enable) {
            console.log('PokiSDK: debug mode', enable);
        },
        
        // Ad blocking detection
        isAdBlocked: function() {
            return false;
        },
        
        // Audio context handling
        ensureAudioContext: function(audioContext) {
            return audioContext || new (window.AudioContext || window.webkitAudioContext)();
        },
        
        // Loading progress
        loadingProgress: function(progress) {
            console.log('PokiSDK: loading progress', progress);
        },
        
        // Game finished
        gameFinished: function() {
            console.log('PokiSDK: game finished');
        },
        
        // Destroy/cleanup
        destroy: function() {
            console.log('PokiSDK: SDK destroyed');
        },
        
        // Channel info
        getChannel: function() {
            return Promise.resolve({
                id: 'stub',
                name: 'Stub Channel'
            });
        },
        
        // Game info
        getGame: function() {
            return Promise.resolve({
                id: 'stub-game',
                name: 'Stub Game'
            });
        },
        setDebug: function() {
            console.log('debug')
        },
        gameLoadingStart: function() {
            console.log('start')
        },
        gameLoadingProgress: function() {
            console.log('progress')
        }
    };
    
    // Also create the legacy Poki global for backward compatibility
    window.Poki = window.PokiSDK;
    
    // Mark SDK as loaded
    window.PokiSDKLoaded = true;
    
    // Dispatch loaded events for different detection methods
    if (typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('PokiSDKLoaded'));
        window.dispatchEvent(new Event('poki-sdk-loaded'));
    }
    
    // Also support callback-based loading
    if (typeof window.onPokiSDKLoaded === 'function') {
        window.onPokiSDKLoaded();
    }
    
    console.log('Poki SDK Stub loaded successfully - using PokiSDK global');
})();