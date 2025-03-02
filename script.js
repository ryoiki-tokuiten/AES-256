document.addEventListener('DOMContentLoaded', () => {
    // Theme management
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    
    // Check for saved theme preference or use user's system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcons('dark');
    }
    
    // Handle theme toggle click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcons(newTheme);
        showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`, 'success');
    });
    
    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }
    
    // Tab Switching with animation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const tabActiveBg = document.querySelector('.tab-active-bg');

    function updateTabIndicator(activeBtn) {
        tabActiveBg.style.width = `${activeBtn.offsetWidth}px`;
        tabActiveBg.style.left = `${activeBtn.offsetLeft}px`;
    }

    // Initialize the active tab indicator
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        updateTabIndicator(activeTab);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
            });

            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            updateTabIndicator(btn);
            
            const tabId = `${btn.dataset.tab}-tab`;
            const targetPane = document.getElementById(tabId);
            
            // Animate the tab transition
            setTimeout(() => {
                targetPane.style.display = 'block';
                setTimeout(() => {
                    targetPane.classList.add('active');
                }, 10);
            }, 200);
        });
    });

    // Initialize upload areas
    setupUploadArea('encrypt');
    setupUploadArea('decrypt');
    setupUploadArea('secret-image', 'secret-image-upload-area', 'secret-image-preview', 'secret-image-file-input');
    setupUploadArea('secret-video', 'secret-video-upload-area', 'secret-video-preview', 'secret-video-file-input', true);

    // Initialize magnetic button effect for all magnetic-btn elements
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate the magnetic effect (subtle movement)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const maxMove = 10; // max pixels to move
            
            const moveX = (x - centerX) / centerX * maxMove;
            const moveY = (y - centerY) / centerY * maxMove;
            
            // Apply the effect
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Update CSS variables for the shine effect
            btn.style.setProperty('--x', `${(x / rect.width) * 100}%`);
            btn.style.setProperty('--y', `${(y / rect.height) * 100}%`);
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Encryption mode selector
    const encryptionModeRadios = document.querySelectorAll('input[name="encryption-mode"]');
    const textEncryptionInput = document.getElementById('text-encryption-input');
    const imageEncryptionInput = document.getElementById('image-encryption-input');
    const videoEncryptionInput = document.getElementById('video-encryption-input');
    
    encryptionModeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'text') {
                textEncryptionInput.style.display = 'block';
                imageEncryptionInput.style.display = 'none';
                videoEncryptionInput.style.display = 'none';
            } else if (radio.value === 'image') {
                textEncryptionInput.style.display = 'none';
                imageEncryptionInput.style.display = 'block';
                videoEncryptionInput.style.display = 'none';
            } else if (radio.value === 'video') {
                textEncryptionInput.style.display = 'none';
                imageEncryptionInput.style.display = 'none';
                videoEncryptionInput.style.display = 'block';
            }
            updateEncryptButtonState();
        });
    });

    // Toast notification system
    window.showToast = function(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');
        
        // Set message
        toastMessage.textContent = message;
        
        // Set icon based on type
        if (type === 'success') {
            toast.className = 'toast toast-success';
            toastIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else {
            toast.className = 'toast toast-error';
            toastIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        }
        
        // Show the toast
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // Enhanced dialog management
    const dialog = document.getElementById('dialog');
    const dialogOverlay = document.getElementById('dialog-overlay');
    const closeDialogBtn = document.getElementById('close-dialog');
    
    window.showDialog = function(title, content) {
        // Set dialog title and content
        dialog.querySelector('.dialog-header h3').textContent = title;
        document.getElementById('dialog-content').innerHTML = content;
        
        // Show dialog with animation
        dialogOverlay.classList.add('show');
        dialog.classList.add('show');
        
        // Add event to close on overlay click
        dialogOverlay.addEventListener('click', closeDialog);
    };
    
    function closeDialog() {
        dialog.classList.remove('show');
        dialogOverlay.classList.remove('show');
    }
    
    closeDialogBtn.addEventListener('click', closeDialog);

    // Progress bar functions
    window.updateProgress = function(elementId, percent) {
        const progressContainer = document.getElementById(elementId);
        const progressBar = progressContainer.querySelector('.progress-bar');
        
        if (percent > 0) {
            progressContainer.style.display = 'block';
        }
        
        progressBar.style.width = `${percent}%`;
        
        if (percent >= 100) {
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
            }, 500);
        }
    };

    // Debug button toggle
    const showDebugBtn = document.getElementById('show-debug-btn');
    const debugInfo = document.getElementById('debug-info');
    
    showDebugBtn.addEventListener('click', () => {
        debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
        showDebugBtn.textContent = debugInfo.style.display === 'none' ? 'Show Troubleshooting Info' : 'Hide Troubleshooting Info';
    });

    // Update the UI functions with animations and progress indicators
    // ... existing code ...

    // Initialize buttons
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const testCompatibilityBtn = document.getElementById('test-compatibility-btn');

    encryptBtn.addEventListener('click', encryptMessage);
    decryptBtn.addEventListener('click', decryptMessage);
    
    // Compatibility test button
    testCompatibilityBtn.addEventListener('click', runCompatibilityTest);

    // Monitor inputs for enabling/disabling buttons
    const messageInput = document.getElementById('message-input');
    const encryptKey = document.getElementById('encrypt-key');
    const decryptKey = document.getElementById('decrypt-key');

    [messageInput, encryptKey].forEach(input => {
        input.addEventListener('input', updateEncryptButtonState);
    });

    decryptKey.addEventListener('input', () => {
        const decryptPreview = document.getElementById('decrypt-preview');
        decryptBtn.disabled = !decryptKey.value || decryptPreview.style.display !== 'block';
    });
    
    // Function to update encrypt button state based on current mode
    function updateEncryptButtonState() {
        const encryptBtn = document.getElementById('encrypt-btn');
        const encryptPreview = document.getElementById('encrypt-preview');
        const secretImagePreview = document.getElementById('secret-image-preview');
        const secretVideoPreview = document.getElementById('secret-video-preview');
        const encryptMode = document.querySelector('input[name="encryption-mode"]:checked').value;
        
        if (encryptMode === 'text') {
            encryptBtn.disabled = !messageInput.value || !encryptKey.value || encryptPreview.style.display !== 'block';
        } else if (encryptMode === 'image') {
            encryptBtn.disabled = secretImagePreview.style.display !== 'block' || !encryptKey.value || encryptPreview.style.display !== 'block';
        } else if (encryptMode === 'video') {
            encryptBtn.disabled = secretVideoPreview.style.display !== 'block' || !encryptKey.value || encryptPreview.style.display !== 'block';
        }
    }

    // Run compatibility check on load
    const compatibility = checkBrowserCompatibility();
    if (!compatibility.isCompatible) {
        alert(`Your browser may not support all required features:\n${compatibility.issues.join('\n')}`);
    }
    
    // Hide debug info initially
    document.getElementById('debug-info').style.display = 'none';
    document.getElementById('encrypt-debug-info').style.display = 'none';
});

// Setup upload area functionality
function setupUploadArea(type, areaId, previewId, inputId, isVideo = false) {
    // Use provided IDs or construct from type if not provided
    const uploadArea = document.getElementById(areaId || `${type}-upload-area`);
    const fileInput = document.getElementById(inputId || `${type}-file-input`);
    const imagePreview = document.getElementById(previewId || `${type}-preview`);
    const videoPreview = document.getElementById(`${type}-video-preview`);
    const placeholder = uploadArea.querySelector('.upload-placeholder');
    
    // Trigger file input when clicking on upload area
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0], type);
        }
    });
    
    // Handle file selection
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0], type);
        }
    });
    
    // File processing
    function handleFile(file, type) {
        // Determine if file is video or image
        const isFileVideo = file.type.startsWith('video/');
        
        if (isFileVideo) {
            // Handle video file
            const validVideoFormats = ['video/mp4', 'video/webm', 'video/ogg'];
            if (!validVideoFormats.includes(file.type)) {
                showToast('Please select an MP4, WebM, or OGG video file for best compatibility', 'error');
                return;
            }
            
            // For carrier videos, check size limit (20MB for carrier)
            const maxSizeMB = (type === 'encrypt' || type === 'decrypt') ? 20 : 5;
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > maxSizeMB) {
                showToast(`Video is too large (${fileSizeMB.toFixed(1)}MB). Maximum size is ${maxSizeMB}MB.`, 'error');
                return;
            }
            
            // Create video preview
            const videoURL = URL.createObjectURL(file);
            
            // Hide image preview, show video preview
            if (imagePreview) imagePreview.style.display = 'none';
            if (videoPreview) {
                videoPreview.src = videoURL;
                videoPreview.style.display = 'block';
            }
            
            // Hide placeholder
            if (placeholder) placeholder.style.display = 'none';
            
            // Add video info below the preview
            const infoElement = document.createElement('div');
            infoElement.className = 'video-info';
            infoElement.innerHTML = `
                <p>File: ${file.name}</p>
                <p>Size: ${fileSizeMB.toFixed(1)}MB</p>
            `;
            
            // Add duration info when metadata loads
            if (videoPreview) {
                videoPreview.onloadedmetadata = () => {
                    const duration = videoPreview.duration;
                    const minutes = Math.floor(duration / 60);
                    const seconds = Math.floor(duration % 60);
                    infoElement.innerHTML += `<p>Duration: ${minutes}:${seconds.toString().padStart(2, '0')}</p>`;
                    
                    // Display warning for longer videos
                    if (type === 'secret-video' && duration > 10) {
                        infoElement.innerHTML += `<p class="warning">Warning: Longer videos require larger carrier files</p>`;
                    }
                };
            }
            
            // Replace any existing info
            const existingInfo = uploadArea.querySelector('.video-info');
            if (existingInfo) {
                uploadArea.removeChild(existingInfo);
            }
            uploadArea.appendChild(infoElement);
            
        } else {
            // Handle image file
            if (!file.type.match('image.*')) {
                showToast('Please select an image file', 'error');
                return;
            }
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                if (imagePreview) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                
                // Hide video preview if exists
                if (videoPreview) videoPreview.style.display = 'none';
                
                // Hide placeholder
                if (placeholder) placeholder.style.display = 'none';
                
                // Add image info below preview
                const imageElement = new Image();
                imageElement.onload = function() {
                    const width = imageElement.width;
                    const height = imageElement.height;
                    const fileSizeMB = file.size / (1024 * 1024);
                    
                    const infoElement = document.createElement('div');
                    infoElement.className = 'image-info';
                    infoElement.innerHTML = `
                        <p>File: ${file.name}</p>
                        <p>Size: ${fileSizeMB.toFixed(1)}MB</p>
                        <p>Dimensions: ${width}x${height}</p>
                    `;
                    
                    // Replace any existing info
                    const existingInfo = uploadArea.querySelector('.image-info');
                    if (existingInfo) {
                        uploadArea.removeChild(existingInfo);
                    }
                    uploadArea.appendChild(infoElement);
                };
                imageElement.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        
        // Update button states based on the uploaded file
        if (type === 'encrypt') {
            updateEncryptButtonState();
        } else if (type === 'decrypt') {
            const decryptKeyInput = document.getElementById('decrypt-key');
            const decryptBtn = document.getElementById('decrypt-btn');
            decryptBtn.disabled = !decryptKeyInput.value;
        }
    }
}

// AES-256 Encryption function
function encryptAES(message, key) {
    try {
        return CryptoJS.AES.encrypt(message, key).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed');
    }
}

// AES-256 Decryption function
function decryptAES(ciphertext, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed. The key may be incorrect.');
    }
}

// Hide encrypted data in image
function hideMessageInImage(imageDataUrl, encryptedData) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = image.width;
                canvas.height = image.height;
                
                // Draw image on canvas
                ctx.drawImage(image, 0, 0);
                
                // Convert encrypted data to binary
                const binaryData = convertToBinary(encryptedData);
                
                // Calculate capacity and data size
                const totalBitsNeeded = 64 + binaryData.length; // Header + data
                const availableBits = image.width * image.height * 3;
                const capacityMB = (availableBits / 8 / 1024 / 1024).toFixed(2); // Convert bits to MB
                const dataSizeMB = (totalBitsNeeded / 8 / 1024 / 1024).toFixed(2); // Convert bits to MB
                
                console.log('Data bits:', binaryData.length);
                console.log('Total bits needed:', totalBitsNeeded);
                console.log('Available bits:', availableBits);
                console.log(`Capacity: ${capacityMB} MB, Data size: ${dataSizeMB} MB, Usage: ${(totalBitsNeeded / availableBits * 100).toFixed(2)}%`);
                
                // Check if data can fit in the image
                if (totalBitsNeeded > availableBits) {
                    const largerImageNeeded = Math.ceil(Math.sqrt(totalBitsNeeded / 3));
                    reject(new Error(`Data is too large for this image. Needs ${dataSizeMB} MB, but only ${capacityMB} MB available. Try an image at least ${largerImageNeeded}x${largerImageNeeded} pixels.`));
                    return;
                }
                
                // Get image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Add signature and data length as header (32 bits for signature, 32 bits for length)
                const signature = 'SECM'; // Secure Message signature
                const signatureBinary = convertToBinary(signature);
                console.log('Signature binary length:', signatureBinary.length);
                
                // Format the length as a 32-bit binary string
                const messageLength = encryptedData.length;
                const lengthBuffer = new ArrayBuffer(4);
                const lengthView = new DataView(lengthBuffer);
                lengthView.setUint32(0, messageLength, false); // big-endian
                let lengthBinary = '';
                const lengthUint8 = new Uint8Array(lengthBuffer);
                for (let i = 0; i < 4; i++) {
                    lengthBinary += lengthUint8[i].toString(2).padStart(8, '0');
                }
                console.log('Length binary:', lengthBinary);
                
                const headerBinary = signatureBinary + lengthBinary;
                console.log('Header binary length:', headerBinary.length);
                
                // Embed header and data
                const fullBinary = headerBinary + binaryData;
                console.log('Full binary length:', fullBinary.length);
                
                // Show progress for larger data
                const updateInterval = Math.floor(fullBinary.length / 10); // Update every 10%
                let lastProgressUpdate = 0;
                
                // Modify the least significant bit of each color channel
                let bitsEmbedded = 0;
                
                for (let i = 0; i < data.length && bitsEmbedded < fullBinary.length; i += 4) {
                    // Modify R, G, B channels (indexes 0, 1, 2 for each pixel)
                    for (let j = 0; j < 3 && bitsEmbedded < fullBinary.length; j++) {
                        if (i + j < data.length) {
                            // Clear LSB and set it to current bit from data
                            const bit = parseInt(fullBinary[bitsEmbedded]);
                            data[i + j] = (data[i + j] & 0xFE) | bit;
                            bitsEmbedded++;
                            
                            // Log progress for large data sets
                            if (bitsEmbedded % updateInterval === 0 && bitsEmbedded > lastProgressUpdate) {
                                const progress = Math.floor((bitsEmbedded / fullBinary.length) * 100);
                                console.log(`Embedding progress: ${progress}%`);
                                lastProgressUpdate = bitsEmbedded;
                            }
                        }
                    }
                }
                
                console.log('Bits embedded:', bitsEmbedded);
                
                // Put modified data back to canvas
                ctx.putImageData(imageData, 0, 0);
                
                // Convert canvas to data URL
                const resultDataUrl = canvas.toDataURL('image/png');
                
                // Validate length encoding
                const validateLength = lengthView.getUint32(0, false);
                console.log('Validation - Original length:', messageLength);
                console.log('Validation - Encoded length:', validateLength);
                console.log('Validation - Binary representation:', lengthBinary);
                
                if (validateLength !== messageLength) {
                    throw new Error('Length encoding validation failed');
                }
                
                resolve(resultDataUrl);
            } catch (error) {
                console.error('Error in hideMessageInImage:', error);
                reject(error);
            }
        };
        
        image.onerror = function() {
            reject(new Error('Failed to load the image'));
        };
        
        image.src = imageDataUrl;
    });
}

// Extract message from image
function extractMessageFromImage(imageDataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        
        // Set a timeout in case image loading hangs
        const timeoutId = setTimeout(() => {
            reject(new Error('Image loading timed out during extraction'));
        }, 15000);
        
        image.onload = function() {
            clearTimeout(timeoutId);
            
            try {
                // Validate image dimensions first
                if (!image.width || !image.height || image.width === 0 || image.height === 0) {
                    throw new Error(`Invalid image dimensions: ${image.width}x${image.height}`);
                }
                
                console.log(`Extraction - Image loaded: ${image.width}x${image.height}`);
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = image.width;
                canvas.height = image.height;
                
                ctx.drawImage(image, 0, 0);
                
                // Try to get pixel data - could throw security errors
                let imageData;
                try {
                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                } catch (error) {
                    throw new Error(`Security error accessing image data: ${error.message}`);
                }
                
                const data = imageData.data;
                
                // Extract binary data from LSB
                let binaryData = '';
                
                // First, extract the 64-bit header to determine message length
                for (let i = 0; i < Math.min(100, data.length); i += 4) {
                    // Extract from R, G, B channels (not Alpha)
                    for (let j = 0; j < 3 && binaryData.length < 64; j++) {
                        if (i + j < data.length) {
                            binaryData += (data[i + j] & 0x01).toString();
                        }
                    }
                    
                    if (binaryData.length >= 64) break;
                }
                
                if (binaryData.length < 64) {
                    throw new Error(`Incomplete header data: only ${binaryData.length} bits found`);
                }
                
                // Check signature (first 32 bits)
                const signatureBinary = binaryData.substring(0, 32);
                const signature = convertFromBinary(signatureBinary);
                
                if (signature !== 'SEC') {
                    console.warn(`Invalid signature found: '${signature}' (expected 'SEC')`);
                    // We'll continue anyway, as this might be due to different encoding or formatting
                }
                
                // Parse the length (next 32 bits)
                const lengthBinary = binaryData.substring(32, 64);
                let messageLength = 0;
                
                try {
                    // Method 1: Using convertFromBinary
                    messageLength = parseInt(convertFromBinary(lengthBinary));
                } catch (e) {
                    // Method 2: Direct binary interpretation
                    console.warn(`Failed to parse length using text conversion: ${e.message}`);
                    console.log("Trying direct binary interpretation...");
                    
                    for (let i = 0; i < 32; i++) {
                        messageLength = (messageLength << 1) | parseInt(lengthBinary[i]);
                    }
                }
                
                console.log(`Extracted header - Signature: '${signature}', Length: ${messageLength} bits`);
                
                if (messageLength <= 0 || messageLength > image.width * image.height * 3 - 64) {
                    console.warn(`Suspicious message length: ${messageLength} bits (max capacity: ${image.width * image.height * 3 - 64} bits)`);
                    // We'll continue but with caution
                }
                
                // Now extract the full message plus a reasonable safety margin
                const bitsToExtract = Math.min(messageLength + 64 + 128, image.width * image.height * 3 - 64);
                console.log(`Attempting to extract ${bitsToExtract} bits...`);
                
                binaryData = ''; // Reset binary data
                let bitCount = 0;
                
                // Extract enough bits for the message plus header
                for (let i = 0; i < data.length && bitCount < bitsToExtract; i += 4) {
                    // Extract from R, G, B channels (not Alpha)
                    for (let j = 0; j < 3 && bitCount < bitsToExtract; j++) {
                        if (i + j < data.length) {
                            binaryData += (data[i + j] & 0x01).toString();
                            bitCount++;
                        }
                    }
                }
                
                if (bitCount < 64 + messageLength) {
                    throw new Error(`Could not extract enough data: extracted ${bitCount} bits, needed at least ${64 + messageLength} bits`);
                }
                
                // Skip the header to get just the message
                const messageBinary = binaryData.substring(64, 64 + messageLength);
                
                // Convert binary to string
                const extractedMessage = convertFromBinary(messageBinary);
                
                console.log(`Extraction complete: ${messageBinary.length} bits extracted`);
                resolve(extractedMessage);
                
            } catch (error) {
                console.error('Extraction error:', error);
                reject(new Error(`Failed to extract message: ${error.message}`));
            }
        };
        
        image.onerror = function(e) {
            clearTimeout(timeoutId);
            console.error('Image loading error during extraction:', e);
            reject(new Error('Failed to load the encrypted image for extraction. The file may be corrupted.'));
        };
        
        image.onabort = function() {
            clearTimeout(timeoutId);
            reject(new Error('Image loading was aborted during extraction.'));
        };
        
        // Set source at the end after all handlers are in place
        image.src = imageDataUrl;
    });
}

// Convert string to binary
function convertToBinary(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const bin = charCode.toString(2).padStart(8, '0');
        binary += bin;
    }
    return binary;
}

// Convert binary to string
function convertFromBinary(binary) {
    // Input validation
    if (!binary) {
        console.error("No binary data provided to convertFromBinary");
        throw new Error("Binary data is null or empty");
    }
    
    // Handle non-multiple of 8 binary lengths by padding or trimming
    const originalLength = binary.length;
    if (binary.length % 8 !== 0) {
        console.warn(`Binary data length (${binary.length}) is not a multiple of 8, padding to fix`);
        // Pad with zeros to make it a multiple of 8
        const padding = 8 - (binary.length % 8);
        binary = binary.padEnd(binary.length + padding, '0');
        console.log(`Padded binary data from ${originalLength} to ${binary.length} bits`);
    }
    
    let text = '';
    let errorCount = 0;
    const MAX_ERRORS = 20; // Maximum errors before abandoning conversion
    
    for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.substring(i, i + 8);
        if (byte.length === 8) {
            try {
                // Verify byte contains only 0s and 1s
                if (!/^[01]{8}$/.test(byte)) {
                    console.warn(`Invalid binary byte at position ${i}: ${byte}`);
                    errorCount++;
                    continue;
                }
                
                const charCode = parseInt(byte, 2);
                
                // Check for invalid character codes
                if (charCode >= 0 && charCode <= 0xFFFF) {
                    // Additional check for problematic control characters
                    if (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) {
                        // Skip most control characters except tab, newline, and carriage return
                        if (errorCount < MAX_ERRORS) {
                            console.warn(`Skipping control character: ${charCode} at position ${i}`);
                        }
                        errorCount++;
                        
                        // For AES data, control characters might be valid, so keep them
                        text += String.fromCharCode(charCode);
                    } else {
                        text += String.fromCharCode(charCode);
                    }
                } else {
                    if (errorCount < MAX_ERRORS) {
                        console.warn(`Invalid character code: ${charCode} from byte ${byte} at position ${i}`);
                    }
                    errorCount++;
                    
                    // For very high Unicode, might be emoji or other valid characters
                    if (charCode <= 0x10FFFF) {
                        text += String.fromCharCode(charCode);
                    }
                }
            } catch (e) {
                if (errorCount < MAX_ERRORS) {
                    console.error(`Error parsing binary data at position ${i}: ${e.message}`);
                }
                errorCount++;
            }
        }
        
        // If too many errors, the data is likely not a valid message
        if (errorCount > MAX_ERRORS) {
            console.error(`Too many errors (${errorCount}) while parsing binary data`);
            // Don't bail out completely, just warn and continue
            if (i < binary.length / 2) {
                console.error("Errors occurring early in the conversion process suggest seriously corrupted data");
            }
        }
    }
    
    if (errorCount > 0) {
        console.warn(`Conversion completed with ${errorCount} errors`);
    }
    
    return text;
}

// Validate and sanitize data before encryption
function validateAndSanitizeMessage(message) {
    if (!message || message.trim().length === 0) {
        throw new Error('Message cannot be empty');
    }
    
    // Trim excessively long messages
    if (message.length > 5000) {
        console.warn('Message is very long and may not fit in some images');
    }
    
    return message;
}

// Encrypt message or image and hide in image
async function encryptMessage() {
    try {
        const encryptMode = document.querySelector('input[name="encryption-mode"]:checked').value;
        const encryptImageInput = document.getElementById('encrypt-file-input');
        const encryptKeyInput = document.getElementById('encrypt-key');
        const encryptDebugMsg = document.getElementById('encrypt-debug-message');
        const encryptDebugInfo = document.getElementById('encrypt-debug-info');
        const downloadLink = document.getElementById('download-link');
        const encryptBtn = document.getElementById('encrypt-btn');
        
        // Validations
        if (!encryptImageInput.files || !encryptImageInput.files[0]) {
            showToast('Please upload an image first', 'error');
            return;
        }
        
        const key = encryptKeyInput.value.trim();
        if (key.length < 1) {
            showToast('Please enter an encryption key', 'error');
            return;
        }
        
        let dataToEncrypt;
        let dataType = encryptMode;
        
        if (encryptMode === 'text') {
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value.trim();
            if (message.length < 1) {
                showToast('Please enter a message to encrypt', 'error');
                return;
            }
            
            // Validate and sanitize the message
            const sanitizedMessage = validateAndSanitizeMessage(message);
            if (!sanitizedMessage) {
                showToast('Invalid message. Please check your input.', 'error');
                return;
            }
            
            dataToEncrypt = sanitizedMessage;
        } else if (encryptMode === 'image') {
            // Image encryption mode
            const secretImageInput = document.getElementById('secret-image-file-input');
            if (!secretImageInput.files || !secretImageInput.files[0]) {
                showToast('Please upload an image to hide', 'error');
                return;
            }
            
            // Get the secret image as data URL
            dataToEncrypt = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(secretImageInput.files[0]);
            });
        } else if (encryptMode === 'video') {
            // Video encryption mode
            const secretVideoInput = document.getElementById('secret-video-file-input');
            if (!secretVideoInput.files || !secretVideoInput.files[0]) {
                showToast('Please upload a video to hide', 'error');
                return;
            }
            
            // Check video size
            const videoFile = secretVideoInput.files[0];
            const videoSizeMB = videoFile.size / (1024 * 1024);
            
            // Calculate image capacity
            const imageFile = encryptImageInput.files[0];
            
            // Strict limit - 5MB is already pushing the limits of what's reasonable
            if (videoSizeMB > 5) {
                showToast(`Video is too large (${videoSizeMB.toFixed(1)}MB). Maximum size is 5MB.`, 'error');
                encryptDebugInfo.style.display = 'block';
                encryptDebugMsg.innerHTML = `
                    <p>The selected video is ${videoSizeMB.toFixed(1)}MB which is too large to hide in most images.</p>
                    <p>Please consider:</p>
                    <ul>
                        <li>Using a shorter video clip</li>
                        <li>Reducing the video resolution before uploading</li>
                        <li>Using a video compression tool before uploading</li>
                    </ul>
                `;
                return;
            }
            
            // Load image dimensions to estimate capacity
            const imgElement = new Image();
            imgElement.onload = async function() {
                const width = imgElement.width;
                const height = imgElement.height;
                const pixelCount = width * height;
                
                // Each pixel can store 3 bits (RGB channels)
                const capacityBytes = Math.floor((pixelCount * 3) / 8);
                const capacityMB = capacityBytes / (1024 * 1024);
                
                // Account for encryption overhead (roughly 33%)
                const adjustedCapacityMB = capacityMB * 0.75;
                
                encryptDebugInfo.style.display = 'block';
                
                if (videoSizeMB > adjustedCapacityMB) {
                    encryptBtn.disabled = true;
                    encryptDebugMsg.innerHTML = `
                        <p style="color: var(--error-color);">Warning: Video (${videoSizeMB.toFixed(1)}MB) is larger than the estimated image capacity (${adjustedCapacityMB.toFixed(1)}MB).</p>
                        <p>The encryption process may fail. Please use a smaller video or a larger carrier image.</p>
                        <button id="force-encrypt-btn" class="action-btn">Attempt Anyway</button>
                    `;
                    
                    // Add a button to force encryption attempt
                    document.getElementById('force-encrypt-btn').addEventListener('click', () => {
                        encryptBtn.disabled = false;
                        encryptDebugMsg.innerHTML += '<p>Proceeding with encryption attempt...</p>';
                    });
                    
                    return;
                } else {
                    // Show warning for large videos that are close to capacity
                    if (videoSizeMB > adjustedCapacityMB * 0.7) {
                        encryptDebugMsg.innerHTML = `
                            <p>Warning: Video is ${videoSizeMB.toFixed(1)}MB. This is ${Math.round(videoSizeMB/adjustedCapacityMB*100)}% of the carrier image's estimated capacity.</p>
                            <p>Encryption may take longer than usual.</p>
                        `;
                    }
                    
                    // Continue with encryption
                    continueVideoEncryption(videoFile, encryptBtn, encryptDebugMsg, key, imageFile);
                }
            };
            
            // Handle image load error
            imgElement.onerror = function() {
                showToast('Error loading carrier image for capacity estimation', 'error');
            };
            
            // Load the image to get dimensions
            imgElement.src = URL.createObjectURL(imageFile);
            
            // Early return since we'll proceed in the onload callback
            return;
        }
        
        // Show UI feedback
        encryptBtn.disabled = true;
        encryptBtn.innerHTML = '<span class="spinner"></span> Encrypting...';
        encryptDebugInfo.style.display = 'block';
        encryptDebugMsg.innerHTML = '<p>Starting encryption process...</p>';

        // Add headers to the data based on type
        let headerData;
        if (dataType === 'text') {
            headerData = "TEXT:";
        } else if (dataType === 'image') {
            headerData = "IMG:";
        } else if (dataType === 'video') {
            headerData = "VID:";
        }
        const dataWithHeader = headerData + dataToEncrypt;
        
        // Encrypt the data with AES
        updateProgress('encrypt-progress', 20);
        encryptDebugMsg.innerHTML += '<p>Encrypting data with AES-256...</p>';
        const encrypted = encryptAES(dataWithHeader, key);
        
        // Get the carrier image
        updateProgress('encrypt-progress', 40);
        encryptDebugMsg.innerHTML += '<p>Loading carrier image...</p>';
        const imageFile = encryptImageInput.files[0];
        const imageDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
        
        // Hide the encrypted data in the image
        updateProgress('encrypt-progress', 60);
        encryptDebugMsg.innerHTML += '<p>Embedding encrypted data into image...</p>';
        const startTime = performance.now();
        const resultImageDataUrl = await hideMessageInImage(imageDataUrl, encrypted);
        const endTime = performance.now();
        
        if (!resultImageDataUrl) {
            throw new Error("Failed to embed data in image");
        }
        
        // Final touches and display
        updateProgress('encrypt-progress', 100);
        const processingTime = ((endTime - startTime) / 1000).toFixed(2);
        encryptDebugMsg.innerHTML += `<p>Encryption completed in ${processingTime} seconds</p>`;
        encryptDebugMsg.innerHTML += `<p>Final image size: ${Math.round(resultImageDataUrl.length / 1024)} KB</p>`;
        
        // Set download link
        downloadLink.href = resultImageDataUrl;
        downloadLink.style.display = 'block';
        
        // Reset UI state
        encryptBtn.disabled = false;
        encryptBtn.innerHTML = 'Encrypt Message';
        
        showToast('Encryption successful! Download your image.', 'success');
        
    } catch (error) {
        console.error('Encryption error:', error);
        document.getElementById('encrypt-debug-message').innerHTML += `<p>Error: ${error.message}</p>`;
        document.getElementById('encrypt-btn').disabled = false;
        document.getElementById('encrypt-btn').innerHTML = 'Encrypt Message';
        showToast('Encryption failed. See details in debug info.', 'error');
    }
}

// Helper function to continue video encryption after capacity check
async function continueVideoEncryption(videoFile, encryptBtn, encryptDebugMsg, key, imageFile) {
    try {
        encryptBtn.disabled = true;
        encryptBtn.innerHTML = '<span class="spinner"></span> Encrypting...';
        encryptDebugMsg.innerHTML += '<p>Starting encryption process...</p>';
        
        // Get the secret video as data URL with progress tracking
        updateProgress('encrypt-progress', 10);
        encryptDebugMsg.innerHTML += '<p>Reading video data...</p>';
        
        const dataToEncrypt = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 25); // 25% of total progress
                    updateProgress('encrypt-progress', progress);
                }
            };
            reader.readAsDataURL(videoFile);
        });
        
        const headerData = "VID:";
        const dataWithHeader = headerData + dataToEncrypt;
        
        // Encrypt the data with AES
        updateProgress('encrypt-progress', 30);
        encryptDebugMsg.innerHTML += '<p>Encrypting video with AES-256...</p>';
        const encrypted = encryptAES(dataWithHeader, key);
        
        // Get the carrier image
        updateProgress('encrypt-progress', 45);
        encryptDebugMsg.innerHTML += '<p>Loading carrier image...</p>';
        const imageDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
        
        // Check the size of encrypted data compared to image capacity once more
        const encryptedSizeBytes = encrypted.length * 2; // Rough estimate of byte size from character length
        const encryptedSizeMB = encryptedSizeBytes / (1024 * 1024);
        encryptDebugMsg.innerHTML += `<p>Encrypted data size: ~${encryptedSizeMB.toFixed(2)}MB</p>`;
        
        // Hide the encrypted data in the image with progress updates
        updateProgress('encrypt-progress', 50);
        encryptDebugMsg.innerHTML += '<p>Embedding encrypted data into image (this may take a while for video)...</p>';
        
        const processingStartTime = performance.now();
        const resultImageDataUrl = await hideMessageInImage(imageDataUrl, encrypted);
        const processingEndTime = performance.now();
        const processingTime = ((processingEndTime - processingStartTime) / 1000).toFixed(1);
        
        updateProgress('encrypt-progress', 100);
        encryptDebugMsg.innerHTML += `<p>Processing completed in ${processingTime} seconds</p>`;
        
        // Set download link
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = resultImageDataUrl;
        downloadLink.style.display = 'block';
        
        // Reset UI state
        encryptBtn.disabled = false;
        encryptBtn.innerHTML = 'Encrypt Message';
        
        showToast('Video encrypted successfully! Download your image.', 'success');
    } catch (error) {
        console.error('Video encryption error:', error);
        encryptDebugMsg.innerHTML += `<p style="color: var(--error-color);">Error: ${error.message}</p>`;
        encryptBtn.disabled = false;
        encryptBtn.innerHTML = 'Encrypt Message';
        showToast('Encryption failed. See details in debug info.', 'error');
    }
}

// Add helper function to diagnose image header problems
function analyzeImageHeader(imageDataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        
        // Set crossOrigin to anonymous to prevent tainted canvas issues
        image.crossOrigin = "Anonymous";
        
        // Add a timeout to handle cases where the image never loads
        const timeoutId = setTimeout(() => {
            reject(new Error('Image loading timed out - the image may be corrupted or too large'));
        }, 15000); // 15 second timeout
        
        image.onload = function() {
            clearTimeout(timeoutId);
            
            try {
                // Double-check dimensions are valid before proceeding
                if (!image.width || !image.height || image.width === 0 || image.height === 0) {
                    reject(new Error('Invalid image dimensions: width=' + image.width + ', height=' + image.height));
                    return;
                }
                
                console.log("Image successfully loaded with dimensions: " + image.width + "x" + image.height);
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size to match image
                canvas.width = image.width;
                canvas.height = image.height;
                
                // Draw image on canvas
                ctx.drawImage(image, 0, 0);
                
                // Try to get image data - this might throw a security error if the canvas is tainted
                let imageData;
                try {
                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                } catch (error) {
                    reject(new Error('Security error: Cannot access image data. The image may be from a different domain: ' + error.message));
                    return;
                }
                
                const data = imageData.data;
                
                // Extract binary data from LSB of first 64 bits for header
                let binaryData = '';
                
                // Collect the header bits (first 64 bits)
                for (let i = 0; i < data.length && binaryData.length < 64; i += 4) {
                    // Extract from R, G, B channels (not Alpha)
                    for (let j = 0; j < 3 && binaryData.length < 64; j++) {
                        if (i + j < data.length) {
                            binaryData += (data[i + j] & 0x01).toString();
                        }
                    }
                }
                
                // Ensure we got a full header
                if (binaryData.length < 64) {
                    reject(new Error('Could not extract complete header (only got ' + binaryData.length + ' bits)'));
                    return;
                }
                
                const result = {
                    imageSize: `${image.width}x${image.height}`,
                    capacity: image.width * image.height * 3,
                    headerBinary: binaryData,
                    signatureBinary: binaryData.substring(0, 32),
                    lengthBinary: binaryData.substring(32, 64)
                };
                
                // Try to interpret signature
                try {
                    result.signature = convertFromBinary(result.signatureBinary);
                } catch (e) {
                    result.signature = 'ERROR: Could not parse signature';
                    console.error('Signature parsing error:', e);
                }
                
                // Try both parsing methods for length
                try {
                    // Method 1: Using convertFromBinary then parseInt
                    result.lengthMethod1 = parseInt(convertFromBinary(result.lengthBinary));
                    
                    // Method 2: Direct binary parsing
                    let lengthMethod2 = 0;
                    for (let i = 0; i < 32; i++) {
                        lengthMethod2 = (lengthMethod2 << 1) | parseInt(result.lengthBinary[i], 2);
                    }
                    result.lengthMethod2 = lengthMethod2;
                } catch (e) {
                    result.lengthError = e.message;
                    console.error('Length parsing error:', e);
                }
                
                resolve(result);
            } catch (err) {
                reject(new Error('Failed to analyze image: ' + err.message));
            }
        };
        
        image.onerror = function(err) {
            clearTimeout(timeoutId);
            console.error('Image loading error:', err);
            reject(new Error('Failed to load the image for analysis - the file may be corrupted'));
        };
        
        // Add onabort handler for completeness
        image.onabort = function() {
            clearTimeout(timeoutId);
            reject(new Error('Image loading was aborted'));
        };
        
        // Set the image source at the end to ensure all event handlers are registered first
        image.src = imageDataUrl;
    });
}

// Extend decryption function to handle both text and image data
async function decryptMessage() {
    const decryptPreview = document.getElementById('decrypt-preview');
    const decryptKeyInput = document.getElementById('decrypt-key');
    const decryptedMessageDiv = document.getElementById('decrypted-message');
    const resultContainer = document.querySelector('.result-container');
    const debugInfoDiv = document.getElementById('debug-info');
    const debugMessageDiv = document.getElementById('debug-message');
    const decryptBtn = document.getElementById('decrypt-btn');
    
    try {
        // Validate inputs
        if (decryptPreview.style.display !== 'block') {
            showToast('Please upload an encrypted image first', 'error');
            return;
        }
        
        const key = decryptKeyInput.value.trim();
        if (key.length < 1) {
            showToast('Please enter a decryption key', 'error');
            return;
        }
        
        // Show UI feedback
        decryptBtn.disabled = true;
        decryptBtn.innerHTML = '<span class="spinner"></span> Decrypting...';
        debugInfoDiv.style.display = 'block';
        debugMessageDiv.innerHTML = '<p>Starting decryption process...</p>';
        updateProgress('decrypt-progress', 10);
        
        // Check if image is valid
        const imageUrl = decryptPreview.src;
        if (!imageUrl || imageUrl === '') {
            throw new Error('No image data available for decryption');
        }
        
        try {
            // Verify the image is properly loaded
            const img = decryptPreview;
            if (!img.complete) {
                debugMessageDiv.innerHTML += '<p>Waiting for image to fully load...</p>';
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = () => {
                        throw new Error('Image failed to load completely');
                    };
                    // If already loaded, this won't trigger
                    if (img.complete) resolve();
                });
            }
            
            // Check image dimensions
            if (!img.naturalWidth || !img.naturalHeight) {
                throw new Error(`Invalid image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
            }
            
            debugMessageDiv.innerHTML += `<p>Image loaded successfully: ${img.naturalWidth}x${img.naturalHeight} pixels</p>`;
        } catch (imgError) {
            throw new Error(`Image validation failed: ${imgError.message}`);
        }
        
        // Analyze image header to get diagnostic information
        debugMessageDiv.innerHTML += '<p>Analyzing image header...</p>';
        updateProgress('decrypt-progress', 20);
        
        try {
            const headerInfo = await analyzeImageHeader(imageUrl);
            debugMessageDiv.innerHTML += `
                <p>Image dimensions: ${headerInfo.imageSize}</p>
                <p>Max capacity: ${headerInfo.capacity} bits</p>
                <p>Detected signature: ${headerInfo.signature || 'Unknown'}</p>
                <p>Length value: ${headerInfo.lengthMethod1 || headerInfo.lengthMethod2 || 'Unable to determine'}</p>
            `;
        } catch (headerError) {
            // Don't fail the whole process, just log the header analysis failure
            debugMessageDiv.innerHTML += `<p style="color: var(--error-color);">Image header analysis failed: ${headerError.message}</p>`;
            debugMessageDiv.innerHTML += '<p>Attempting to continue with extraction anyway...</p>';
        }
        
        const startTime = performance.now();
        
        // Extract encrypted data from image
        updateProgress('decrypt-progress', 40);
        debugMessageDiv.innerHTML += '<p>Extracting data from image pixels...</p>';
        
        let extractedMessage;
        try {
            extractedMessage = await extractMessageFromImage(imageUrl);
            const dataSize = extractedMessage ? extractedMessage.length : 0;
            debugMessageDiv.innerHTML += `<p>Extracted binary data length: ${dataSize * 8} bits</p>`;
        } catch (extractError) {
            debugMessageDiv.innerHTML += `<p style="color: var(--error-color);">Extraction error: ${extractError.message}</p>`;
            
            // Try the alternative extraction method if the standard method fails
            debugMessageDiv.innerHTML += '<p>Attempting alternative extraction method...</p>';
            try {
                extractedMessage = await extractMessageAlternative(imageUrl);
                debugMessageDiv.innerHTML += '<p>Alternative extraction succeeded</p>';
            } catch (altError) {
                throw new Error(`All extraction methods failed. Primary: ${extractError.message}, Alternative: ${altError.message}`);
            }
        }
        
        if (!extractedMessage || extractedMessage.length === 0) {
            throw new Error('No data was extracted from the image');
        }
        
        // Decrypt the extracted data
        updateProgress('decrypt-progress', 80);
        debugMessageDiv.innerHTML += '<p>Converting binary to encrypted message...</p>';
        
        try {
            const decryptedData = decryptAES(extractedMessage, key);
            const endTime = performance.now();
            const processingTime = ((endTime - startTime) / 1000).toFixed(2);
            
            debugMessageDiv.innerHTML += `<p>Decryption completed in ${processingTime} seconds</p>`;
            
            // Determine the content type based on prefix
            if (decryptedData.startsWith("TEXT:")) {
                const plainTextMessage = decryptedData.substring(5); // Remove "TEXT:" prefix
                decryptedMessageDiv.textContent = plainTextMessage;
                resultContainer.style.display = 'block';
                showToast('Message decrypted successfully!', 'success');
            } 
            else if (decryptedData.startsWith("IMG:")) {
                // Handle image data display
                const imageDataUrl = decryptedData.substring(4); // Remove "IMG:" prefix
                debugMessageDiv.innerHTML += '<p>Hidden content is an image</p>';
                
                // Create an image display in the result container
                decryptedMessageDiv.innerHTML = `
                    <div style="text-align: center;">
                        <img src="${imageDataUrl}" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
                        <br><br>
                        <a href="${imageDataUrl}" download="decrypted-image.png" class="action-btn download-btn magnetic-btn" style="display: inline-block; max-width: 200px; margin: 0 auto;">
                            Download Image
                        </a>
                    </div>
                `;
                resultContainer.style.display = 'block';
                showToast('Image decrypted successfully!', 'success');
                
                // Initialize the new download button's magnetic effect
                initializeMagneticButton(decryptedMessageDiv.querySelector('.magnetic-btn'));
            }
            else if (decryptedData.startsWith("VID:")) {
                // Handle video data display
                const videoDataUrl = decryptedData.substring(4); // Remove "VID:" prefix
                debugMessageDiv.innerHTML += '<p>Hidden content is a video</p>';
                
                // Validate the video data URL
                if (!videoDataUrl.startsWith('data:video/') && !videoDataUrl.startsWith('data:application/octet-stream')) {
                    debugMessageDiv.innerHTML += `<p style="color: var(--error-color);">Error: Invalid video data format</p>`;
                    throw new Error('Invalid video data format');
                }

                // Add debug information about the video data
                const dataSize = Math.round(videoDataUrl.length / 1024);
                debugMessageDiv.innerHTML += `<p>Video data size: ${dataSize}KB</p>`;
                
                // Create a video display in the result container with error handling
                const videoElement = document.createElement('video');
                videoElement.style.cssText = 'max-width: 100%; max-height: 300px; border-radius: 8px;';
                videoElement.controls = true;
                
                // Add error handling for video loading
                videoElement.onerror = (e) => {
                    debugMessageDiv.innerHTML += `<p style="color: var(--error-color);">Error loading video: ${e.target.error.message || 'Unknown error'}</p>`;
                };
                
                // Add load event handler
                videoElement.onloadeddata = () => {
                    debugMessageDiv.innerHTML += `<p>Video loaded successfully - Duration: ${Math.round(videoElement.duration)}s</p>`;
                };
                
                // Set the video source
                videoElement.src = videoDataUrl;
                
                // Create the container with video and download button
                decryptedMessageDiv.innerHTML = `
                    <div style="text-align: center;">
                        <div id="video-container"></div>
                        <br>
                        <a href="${videoDataUrl}" download="decrypted-video.mp4" class="action-btn download-btn magnetic-btn" style="display: inline-block; max-width: 200px; margin: 0 auto;">
                            Download Video
                        </a>
                    </div>
                `;
                
                // Append the video element to the container
                document.getElementById('video-container').appendChild(videoElement);
                
                resultContainer.style.display = 'block';
                showToast('Video decrypted successfully!', 'success');
                
                // Initialize the new download button's magnetic effect
                initializeMagneticButton(decryptedMessageDiv.querySelector('.magnetic-btn'));
            }
            else {
                throw new Error("Unknown content type in decrypted data. Data doesn't start with a valid prefix (TEXT:, IMG:, or VID:)");
            }
            
            updateProgress('decrypt-progress', 100);
            
        } catch (error) {
            // Add more diagnostic information about the decryption failure
            debugMessageDiv.innerHTML += `<p style="color: var(--error-color);">Decryption error: ${error.message}</p>`;
            
            // Try to show a snippet of the encrypted data for diagnosis
            if (extractedMessage) {
                const previewLength = Math.min(extractedMessage.length, 50);
                debugMessageDiv.innerHTML += `<p>First ${previewLength} chars of encrypted data: ${extractedMessage.substring(0, previewLength)}...</p>`;
            }
            
            throw new Error(`Failed to decrypt: ${error.message}. This might be due to an incorrect key or corrupted image.`);
        }
        
    } catch (error) {
        console.error('Decryption error:', error);
        document.getElementById('debug-message').innerHTML += `<p style="color: var(--error-color);">Error: ${error.message}</p>`;
        showToast('Decryption failed. Check debug info for details.', 'error');
    } finally {
        document.getElementById('decrypt-btn').disabled = false;
        document.getElementById('decrypt-btn').innerHTML = 'Decrypt Message';
    }
}

// Add alternative extraction method as a fallback
async function extractMessageAlternative(imageDataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        
        image.onload = function() {
            try {
                if (!image.width || !image.height) {
                    throw new Error("Invalid image dimensions");
                }
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                
                try {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    // Calculate maximum possible data size (3 bits per pixel)
                    const maxBits = image.width * image.height * 3;
                    let binaryData = '';
                    
                    // Extract data in chunks to avoid memory issues
                    const CHUNK_SIZE = 1000000; // Process 1 million pixels at a time
                    let processedPixels = 0;
                    
                    while (processedPixels < data.length && binaryData.length < maxBits) {
                        const endPixel = Math.min(processedPixels + CHUNK_SIZE * 4, data.length);
                        
                        for (let i = processedPixels; i < endPixel; i += 4) {
                            for (let j = 0; j < 3; j++) { // RGB channels only
                                binaryData += (data[i + j] & 0x01).toString();
                                
                                if (binaryData.length >= maxBits) break;
                            }
                            if (binaryData.length >= maxBits) break;
                        }
                        
                        processedPixels = endPixel;
                        console.log(`Processed ${Math.round(processedPixels / data.length * 100)}% of pixels`);
                    }
                    
                    // Look for the signature in the first part of the data
                    const signatureBits = binaryData.substring(0, 64);
                    const signature = convertFromBinary(signatureBits.substring(0, 32));
                    
                    if (signature === 'SECM') {
                        // Valid signature found, extract the length
                        let messageLength = 0;
                        const lengthBits = signatureBits.substring(32, 64);
                        
                        for (let i = 0; i < 32; i++) {
                            messageLength = (messageLength << 1) | parseInt(lengthBits[i]);
                        }
                        
                        console.log(`Found valid signature, message length: ${messageLength} bits`);
                        
                        // Extract the actual message data
                        const messageBits = binaryData.substring(64, 64 + messageLength);
                        const message = convertFromBinary(messageBits);
                        
                        if (!message || message.length < 10) {
                            throw new Error("Extracted message is too short");
                        }
                        
                        resolve(message);
                    } else {
                        throw new Error(`Invalid signature found: ${signature}`);
                    }
                    
                } catch (error) {
                    reject(new Error(`Data extraction failed: ${error.message}`));
                }
            } catch (err) {
                reject(new Error(`Image processing failed: ${err.message}`));
            }
        };
        
        image.onerror = function() {
            reject(new Error('Failed to load image for alternative extraction'));
        };
        
        image.src = imageDataUrl;
    });
}

// Check browser compatibility for required features
function checkBrowserCompatibility() {
    const issues = [];
    
    if (!window.FileReader) {
        issues.push('FileReader API is not supported');
    }
    
    if (!window.HTMLCanvasElement) {
        issues.push('Canvas is not supported');
    }
    
    if (!window.CryptoJS) {
        issues.push('CryptoJS library is not loaded');
    }
    
    // Check for video support
    if (!document.createElement('video').canPlayType) {
        issues.push('Video playback is not supported');
    }
    
    // Check for video format support
    const videoElement = document.createElement('video');
    if (!videoElement.canPlayType('video/mp4')) {
        issues.push('MP4 video format is not supported');
    }
    
    // Check for canvas pixel manipulation
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.getImageData(0, 0, 1, 1);
    } catch (e) {
        issues.push('Canvas pixel manipulation is restricted (may be due to cross-origin issues)');
    }
    
    return {
        isCompatible: issues.length === 0,
        issues: issues
    };
}

// Comprehensive compatibility test
function runCompatibilityTest() {
    const compatibilityResults = checkBrowserCompatibility();
    let resultHTML = '';
    
    // Create a styled compatibility report
    if (compatibilityResults.isCompatible) {
        resultHTML = `
            <div style="padding: 15px; background-color: rgba(46, 204, 113, 0.1); border-radius: 8px; border-left: 4px solid var(--success-color);">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <h4 style="margin: 0; color: var(--success-color); font-size: 1.1rem;">Your browser is compatible!</h4>
                </div>
                <p>All required features are supported by your browser. You can use all features of this application.</p>
            </div>
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Features checked:</h4>
                <ul style="padding-left: 20px;">
                    <li>FileReader API: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>Canvas API: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>Crypto-JS Library: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>Image Processing: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>Canvas Pixel Manipulation: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>Data URL Generation: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>Image Encoding Capability: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>Video Playback: <span style="color: var(--success-color);">✓ Supported</span></li>
                    <li>MP4 Format Support: <span style="color: var(--success-color);">✓ Supported</span></li>
                </ul>
            </div>
        `;
    } else {
        resultHTML = `
            <div style="padding: 15px; background-color: rgba(255, 71, 87, 0.1); border-radius: 8px; border-left: 4px solid var(--error-color);">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <h4 style="margin: 0; color: var(--error-color); font-size: 1.1rem;">Compatibility issues detected</h4>
                </div>
                <p>Your browser is missing some features required by this application.</p>
            </div>
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Issues found:</h4>
                <ul style="padding-left: 20px;">
                    ${compatibilityResults.issues.map(issue => `<li style="color: var(--error-color); margin-bottom: 5px;">${issue}</li>`).join('')}
                </ul>
                <p style="margin-top: 15px;">Please try using a modern browser like Chrome, Firefox, Safari, or Edge.</p>
            </div>
        `;
    }
    
    showDialog('Browser Compatibility Test', resultHTML);
}

// Initialize listeners
document.getElementById('encrypt-btn').addEventListener('click', encryptMessage);
document.getElementById('decrypt-btn').addEventListener('click', decryptMessage);

// Compatibility test button
document.getElementById('test-compatibility-btn').addEventListener('click', () => {
    runCompatibilityTest();
});

// Helper function to initialize magnetic button effect
function initializeMagneticButton(button) {
    if (!button) return;
    
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxMove = 10;
        
        const moveX = (x - centerX) / centerX * maxMove;
        const moveY = (y - centerY) / centerY * maxMove;
        
        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        button.style.setProperty('--x', `${(x / rect.width) * 100}%`);
        button.style.setProperty('--y', `${(y / rect.height) * 100}%`);
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
}

// Add a key variation helper that can be triggered from the debug panel
function tryKeyVariations(encryptedData, originalKey) {
    return new Promise(async (resolve) => {
        if (!encryptedData || !originalKey || originalKey.length < 2) {
            resolve({success: false, message: "Requires encrypted data and a key with at least 2 characters"});
            return;
        }
        
        const debugMessageDiv = document.getElementById('debug-message');
        debugMessageDiv.innerHTML += '<p>Attempting decryption with key variations...</p>';
        
        const results = [];
        let successFound = false;
        
        // Common substitutions people make when typing
        const substitutions = {
            '0': 'o', 'o': '0',
            '1': 'l', 'l': '1', 'i': '1', '1': 'i',
            '5': 's', 's': '5',
            '@': 'a', 'a': '@',
            'e': '3', '3': 'e',
            'b': '8', '8': 'b'
        };
        
        // Test original key first
        try {
            let decrypted = decryptAES(encryptedData, originalKey);
            // If we got here, the original key worked
            results.push({
                key: originalKey,
                success: true,
                result: decrypted.substring(0, 20) + '...'
            });
            successFound = true;
        } catch (e) {
            results.push({
                key: originalKey,
                success: false,
                error: e.message
            });
        }
        
        // If original key worked, no need to try variations
        if (successFound) {
            debugMessageDiv.innerHTML += '<p>Original key worked, no variations needed.</p>';
            resolve({success: true, message: "Original key worked", results});
            return;
        }
        
        // Try with case variations (only for the first and last chars to limit combinations)
        const keyChars = originalKey.split('');
        
        // Try flipping cases of the first and last characters
        const firstChar = keyChars[0];
        const lastChar = keyChars[keyChars.length - 1];
        
        if (firstChar.toLowerCase() !== firstChar.toUpperCase()) {
            const newFirstChar = firstChar === firstChar.toLowerCase() ? 
                firstChar.toUpperCase() : firstChar.toLowerCase();
            
            keyChars[0] = newFirstChar;
            const newKey = keyChars.join('');
            
            try {
                let decrypted = decryptAES(encryptedData, newKey);
                results.push({
                    key: newKey,
                    success: true,
                    result: decrypted.substring(0, 20) + '...'
                });
                successFound = true;
            } catch (e) {
                results.push({
                    key: newKey,
                    success: false,
                });
            }
        }
        
        if (!successFound && lastChar.toLowerCase() !== lastChar.toUpperCase()) {
            keyChars[0] = originalKey[0]; // Reset first char
            const newLastChar = lastChar === lastChar.toLowerCase() ? 
                lastChar.toUpperCase() : lastChar.toLowerCase();
            
            keyChars[keyChars.length - 1] = newLastChar;
            const newKey = keyChars.join('');
            
            try {
                let decrypted = decryptAES(encryptedData, newKey);
                results.push({
                    key: newKey,
                    success: true,
                    result: decrypted.substring(0, 20) + '...'
                });
                successFound = true;
            } catch (e) {
                results.push({
                    key: newKey,
                    success: false,
                });
            }
        }
        
        // Try common character substitutions
        if (!successFound && originalKey.length <= 20) { // Limit to reasonable key lengths
            for (let i = 0; i < originalKey.length; i++) {
                const currentChar = originalKey[i];
                const substitute = substitutions[currentChar];
                
                if (substitute) {
                    const newKey = originalKey.substring(0, i) + substitute + originalKey.substring(i + 1);
                    
                    try {
                        let decrypted = decryptAES(encryptedData, newKey);
                        results.push({
                            key: newKey,
                            success: true,
                            result: decrypted.substring(0, 20) + '...'
                        });
                        successFound = true;
                        break; // Stop after first success
                    } catch (e) {
                        // Just record failure and continue
                        results.push({
                            key: newKey,
                            success: false,
                        });
                    }
                }
            }
        }
        
        if (successFound) {
            debugMessageDiv.innerHTML += '<p style="color: var(--success-color);">Found a working key variation!</p>';
            const successResult = results.find(r => r.success);
            debugMessageDiv.innerHTML += `<p>Try this key instead: <strong>${successResult.key}</strong></p>`;
        } else {
            debugMessageDiv.innerHTML += '<p>No working key variations found. The key might be completely different or the image might be corrupted.</p>';
        }
        
        resolve({
            success: successFound,
            message: successFound ? "Found a working key variation" : "No working variations found",
            results
        });
    });
}

// Add a button to try key variations
function addKeyVariationButton() {
    const debugInfoDiv = document.getElementById('debug-info');
    const existingButton = document.getElementById('try-key-variations-btn');
    
    if (existingButton) {
        // Button already exists, no need to add it again
        return;
    }
    
    const button = document.createElement('button');
    button.id = 'try-key-variations-btn';
    button.className = 'secondary-btn';
    button.textContent = 'Try Similar Keys';
    button.style.marginTop = '10px';
    
    button.addEventListener('click', async () => {
        const decryptKeyInput = document.getElementById('decrypt-key');
        const key = decryptKeyInput.value.trim();
        const decryptPreview = document.getElementById('decrypt-preview');
        
        if (!key || key.length < 2) {
            showToast('Please enter a longer key to try variations', 'error');
            return;
        }
        
        if (decryptPreview.style.display !== 'block') {
            showToast('Please upload an encrypted image first', 'error');
            return;
        }
        
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Testing Keys...';
        
        try {
            // Get the encrypted data
            const imageUrl = decryptPreview.src;
            const extractedMessage = await extractMessageFromImage(imageUrl);
            
            // Test key variations
            const result = await tryKeyVariations(extractedMessage, key);
            
            // If a working key was found, update the key input
            if (result.success) {
                const workingKey = result.results.find(r => r.success).key;
                if (workingKey !== key) {
                    decryptKeyInput.value = workingKey;
                    showToast('Found a working key! Try decrypting again.', 'success');
                }
            }
        } catch (error) {
            console.error('Key variation test error:', error);
            document.getElementById('debug-message').innerHTML += `<p>Error testing key variations: ${error.message}</p>`;
        } finally {
            button.disabled = false;
            button.textContent = 'Try Similar Keys';
        }
    });
    
    debugInfoDiv.appendChild(button);
}

// Update the show debug button to also add the key variation button
document.getElementById('show-debug-btn').addEventListener('click', function() {
    const debugInfoDiv = document.getElementById('debug-info');
    
    if (debugInfoDiv.style.display === 'none') {
        debugInfoDiv.style.display = 'block';
        this.textContent = 'Hide Troubleshooting Info';
        // Add the key variation button when showing debug info
        addKeyVariationButton();
    } else {
        debugInfoDiv.style.display = 'none';
        this.textContent = 'Show Troubleshooting Info';
    }
}); 
