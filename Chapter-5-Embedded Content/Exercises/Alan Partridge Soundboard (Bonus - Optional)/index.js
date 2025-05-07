document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real application, this would come from scanning the directory
    const allSamples = [
        // Page 1
        [
            { title: "A-ha!", filename: "aha.mp3" },
            { title: "Back of the net!", filename: "back_of_the_net.mp3" },
            { title: "Bang out of order!", filename: "bang_out_of_order.mp3" },
            { title: "Dan's a fantastic man!", filename: "dans_a_fantastic_man.mp3" },
            { title: "Don't be blue, Peter!", filename: "dont_be_blue_peter.mp3" },
            { title: "Goal!", filename: "goal.mp3" },
            { title: "Jackanackanory!", filename: "jackanackanory.mp3" },
            { title: "Jurassic Park!", filename: "jurassic_park.mp3" },
            { title: "Kiss my face!", filename: "kiss_my_face.mp3" }
        ],
        // Page 2
        [
            { title: "Smell my cheese!", filename: "smell_my_cheese.mp3" },
            { title: "Spice World!", filename: "spice_world.mp3" },
            { title: "Stop getting Bond wrong!", filename: "stop_getting_bond_wrong.mp3" },
            { title: "That was classic Partridge!", filename: "that_was_classic_partridge.mp3" },
            { title: "This country!", filename: "this_country.mp3" },
            { title: "Twat!", filename: "twat.mp3" },
            { title: "What a breath of fresh air!", filename: "what_a_breath_of_fresh_air.mp3" },
            { title: "You're a mentalist!", filename: "youre_a_mentalist.mp3" },
            { title: "Your dad's dead!", filename: "your_dads_dead.mp3" }
        ]
    ];

    // DOM Elements
    const sampleGrid = document.getElementById('sample-grid');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');
    const speakButton = document.getElementById('speak-button');
    const ttsInput = document.getElementById('tts-input');
    const voiceSelect = document.getElementById('voice-select');

    // Current page tracker
    let currentPage = 0;
    const totalPages = allSamples.length;

    // Audio element for playing samples
    const audioPlayer = new Audio();

    // Function to create a sound button
    function createSoundButton(sample, index) {
        const button = document.createElement('button');
        button.className = 'sound-button';
        button.setAttribute('data-filename', sample.filename);
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'sound-title';
        titleSpan.textContent = sample.title;
        
        const durationSpan = document.createElement('span');
        durationSpan.className = 'sound-duration';
        durationSpan.textContent = 'Loading...';
        
        button.appendChild(titleSpan);
        button.appendChild(durationSpan);
        
        // Get audio duration when possible
        setTimeout(() => {
            const tempAudio = new Audio('Audio Sampler/' + sample.filename);
            tempAudio.addEventListener('loadedmetadata', () => {
                durationSpan.textContent = tempAudio.duration.toFixed(1) + 's';
            });
            tempAudio.addEventListener('error', () => {
                durationSpan.textContent = 'N/A';
            });
        }, index * 100); // Stagger loading to prevent overwhelming the browser
        
        // Play sound on click
        button.addEventListener('click', () => {
            audioPlayer.pause();
            audioPlayer.src = 'Audio Sampler/' + sample.filename;
            audioPlayer.play();
        });
        
        return button;
    }

    // Function to load a page of samples
    function loadPage(pageNum) {
        // Clear existing buttons
        sampleGrid.innerHTML = '';
        
        // Add new buttons for this page
        allSamples[pageNum].forEach((sample, index) => {
            const button = createSoundButton(sample, index);
            sampleGrid.appendChild(button);
        });
        
        // Update page indicator
        pageIndicator.textContent = `Page ${pageNum + 1} of ${totalPages}`;
        
        // Update navigation buttons visibility
        prevPageBtn.classList.toggle('hidden', pageNum === 0);
        nextPageBtn.classList.toggle('hidden', pageNum === totalPages - 1);
    }

    // Navigation event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            loadPage(currentPage);
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            loadPage(currentPage);
        }
    });

    // Text to speech functionality
    speakButton.addEventListener('click', () => {
        const text = ttsInput.value.trim();
        if (text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                
                // Get available voices
                const voices = window.speechSynthesis.getVoices();
                
                // Set voice based on selection (fallback to default)
                if (voiceSelect.value === 'alan' && voices.length > 1) {
                    // Try to find a British male voice for Alan
                    const britishVoice = voices.find(voice => 
                        voice.lang.includes('en-GB') && voice.name.includes('Male'));
                    
                    if (britishVoice) {
                        utterance.voice = britishVoice;
                    }
                }
                
                // Adjust pitch and rate for Alan-like voice
                if (voiceSelect.value === 'alan') {
                    utterance.pitch = 1.1;  // Slightly higher pitch
                    utterance.rate = 0.9;   // Slightly slower
                }
                
                window.speechSynthesis.speak(utterance);
            } else {
                alert('Sorry, your browser does not support text-to-speech!');
            }
        } else {
            alert('Please enter some text first!');
        }
    });

    // Populate voice selector
    if ('speechSynthesis' in window) {
        // Wait for voices to be loaded
        window.speechSynthesis.onvoiceschanged = function() {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 1) {
                // Keep existing options
                const defaultOption = voiceSelect.options[0];
                const alanOption = voiceSelect.options[1];
                
                // Clear select
                voiceSelect.innerHTML = '';
                
                // Add back default options
                voiceSelect.appendChild(defaultOption);
                voiceSelect.appendChild(alanOption);
            }
        };
    }

    // Initialize the first page
    loadPage(currentPage);
});