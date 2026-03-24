---
layout: post
title: Demonstration of passphrase-protection of content on a static webpage
---

# How to add passphrase-protected content to a static website?
```
test if copy works
```

## Demonstration
This particular content has been encrypted with the passphrase below. Please use it to view the content.
Note: please make sure to not copy any whitespace (e.g. leading/trailing spaces) with the password, as it
will be detected as wrong.


<style>
  /* Minimal container styling */
  .copy-widget-container-icon {
    max-width: 480px; /* Keep it relatively small */
    margin: 1.5em auto; /* Center it horizontally with less vertical spacing */
    padding: 1em; /* Reduced padding */
    border: 1px solid var(--border-color, #e8e8e8); /* Blend with theme border */
    border-radius: 6px; /* Slightly smaller radius */
    background-color: var(--background-color-alt, #fdfdfd); /* Subtle background */
    display: flex; /* Use flexbox for layout */
    align-items: flex-start; /* Align items to the top */
    gap: 0.8em; /* Space between text area and icon */
  }

  /* Textarea for displaying content */
  #copyableTextIcon {
    flex-grow: 1; /* Allow textarea to take available space */
    min-height: 60px; /* Minimum height, even smaller */
    padding: 0.6em;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 4px;
    box-sizing: border-box;
    font-family: monospace; /* Monospace for code/data */
    font-size: 0.9em;
    resize: vertical; /* Allow vertical resizing by user */
    background-color: var(--code-background-color, #f0f0f0); /* Blend with code blocks */
    color: inherit; /* Inherit text color */
  }

  /* Copy icon styling */
  .copy-icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3em; /* Space between icon and status text */
    flex-shrink: 0; /* Prevent it from shrinking */
  }

  .copy-icon {
    width: 24px; /* Icon size */
    height: 24px;
    cursor: pointer;
    fill: var(--link-color, #268bd2); /* Icon color from theme link color */
    transition: fill 0.2s ease, transform 0.1s ease;
  }

  .copy-icon:hover {
    fill: var(--link-color-hover, #1a6ba8); /* Darker on hover */
    transform: translateY(-1px);
  }

  .copy-icon:active {
    transform: translateY(0);
  }

  /* Message for copy status */
  #copyStatusIcon {
    font-size: 0.75em; /* Smaller font for status */
    color: var(--text-color, #555); /* Inherit or default text color */
    white-space: nowrap; /* Prevent wrapping */
  }
  .copy-status-success {
    color: var(--success-color, #28a745); /* Green for success */
    font-weight: bold;
  }
  .copy-status-error {
    color: var(--error-color, #dc3545); /* Red for errors */
    font-weight: bold;
  }
</style>

<div class="copy-widget-container-icon">
  <textarea id="copyableTextIcon" cols="60" wrap="hard" readonly>!!qm89bijWvU#0vaTkaKNh&rOKbGfrfWNnfhlOXy&pWmSZekC5f@!*FkIO8ppa75%4n^iyc0g83a8Yw8WDXMbwgu^9NOsY%YYh1A@Fe@G#Hc8gwZI^Bt*Xj0moOg$ghC</textarea>
  <div class="copy-icon-wrapper">
    <!-- SVG Icon for Copy - Two overlapping squares -->
    <svg class="copy-icon" onclick="copyContentIcon()" viewBox="0 0 24 24">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
    <p id="copyStatusIcon"></p>
  </div>
</div>

<script>
  function copyContentIcon() {
    const copyTextarea = document.getElementById('copyableTextIcon');
    const copyStatus = document.getElementById('copyStatusIcon');

    try {
      // Select the text in the textarea
      copyTextarea.select();
      copyTextarea.setSelectionRange(0, 99999); // For mobile devices

      // Copy the text to the clipboard
      const success = document.execCommand('copy');

      if (success) {
        copyStatus.textContent = "Copied!";
        copyStatus.className = "copy-status-success";
      } else {
        copyStatus.textContent = "Failed.";
        copyStatus.className = "copy-status-error";
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      copyStatus.textContent = "Error.";
      copyStatus.className = "copy-status-error";
    }

    // Briefly reset the status message after a few seconds
    setTimeout(() => {
      copyStatus.textContent = "";
      copyStatus.className = "";
    }, 2000); // Shorter timeout for less prominent feedback
  }

  // Example of setting dynamic content if needed (uncomment and use as desired):
  // document.addEventListener('DOMContentLoaded', () => {
  //   const dynamicContent = "Your dynamic content goes here!";
  //   document.getElementById('copyableTextIcon').value = dynamicContent;
  // });
</script>

{% include protected.html url="/private/demo-encrypted/demo.html.enc" %}
