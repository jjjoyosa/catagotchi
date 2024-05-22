
  

    const progresses = {
        clean: {
            element: document.getElementById('cleanProgress'),
            value: 100,
            button: document.getElementById('cleanBtn')
        },
        feed: {
            element: document.getElementById('feedProgress'),
            value: 100,
            button: document.getElementById('feedBtn')
        },
        pet: {
            element: document.getElementById('petProgress'),
            value: 100,
            button: document.getElementById('petBtn')
        },
        energy: {
            element: document.getElementById('energyProgress'),
            value: 100
        }
    };

    let timeElapsed = 0;
    let decreaseInterval = 500; // Start with 5 seconds
    let shown = false;
    let winShown = false;
    let gameActive = false;
    
    window.onload = function() {
        const startDialog = document.createElement('div');
        startDialog.className = 'nes-dialog is-rounded is-dark';
        startDialog.innerHTML = `
            <p class="title">Welcome to CATAGOTCHI!</p>
            <p>Your goal is to take care of your virtual cat. Make sure to keep it clean, feed it, and pet it regularly. Once you last 25 seconds, you fucking win!</p>
            <br>
            <p>Ticker:</p>
            <p>CA:</p>
            <br>
            <menu class="dialog-menu">
                <button class="nes-btn is-primary" onclick="startGame()">Start</button>
            </menu>
        `;
        document.body.appendChild(startDialog);
    }

    function startGame() {
        const startDialog = document.querySelector('.nes-dialog');
        if (startDialog) {
            startDialog.remove(); // Remove the start dialogue
        }
        gameActive = true; 
    }

    function updateProgress(progress) {
        if (!gameActive) return;
        progress.element.value = progress.value;
        if (progress.value <= 0 && progress !== progresses.energy && !shown) {
            resetGame();
            showRestartDialog();
            shown = true; // Call the function to show the restart dialogue
        }

        if (timeElapsed >= 25 && !winShown && progress.value >= 0 ) {
            resetGame();
            showWinDialog();
            winShown = true; // Set winShown to true once it's shown
        }
    }

    function showWinDialog() {
        const winDialog = document.createElement('div');
        winDialog.className = 'nes-dialog is-rounded is-dark';
        winDialog.innerHTML = `
            <p class="title">Congratulations!</p>
            <p>You won!</p>
            <menu class="dialog-menu">
                <button class="nes-btn is-primary" onclick="restartGame()">Restart</button>
            </menu>
        `;
        document.body.appendChild(winDialog);
    }

    function showRestartDialog() {
        const restartDialog = document.createElement('div');
        restartDialog.className = 'nes-dialog is-rounded is-dark';
        restartDialog.innerHTML = `
            <p class="title">Game Over!</p>
            <p>You didn't take care of your cat!</p>
            <menu class="dialog-menu">
                <button class="nes-btn is-error" onclick="restartGame()">Restart</button>
            </menu>
        `;
        document.body.appendChild(restartDialog);
    }

    function restartGame() {
        const restartDialog = document.querySelector('.nes-dialog');
        if (restartDialog) {
            restartDialog.remove(); // Remove the restart dialogue
        }
        window.location.reload();
    }

    function decreaseProgresses() {
        if (!gameActive) return;
        for (let key in progresses) {
            if (progresses[key].value > 0 && key !== 'energy') {
                // Decrement progress by a random value between 1 and 5
                const decrementAmount = Math.floor(Math.random() * 5) + 5;
                progresses[key].value -= decrementAmount;
                updateProgress(progresses[key]);
            }
        }
        // Increase difficulty over time by decreasing the interval
        decreaseInterval = Math.max(1000, decreaseInterval - 100);
        clearInterval(decreaseIntervalId);
        decreaseIntervalId = setInterval(decreaseProgresses, decreaseInterval);
    }

    function handleButtonClick(progress) {
        if (!gameActive) return;
        if (progress.value < 100 && progresses.energy.value >= 5) {
            progress.value += 10;
            if (progress.value > 100) {
                progress.value = 100;
            }
            progresses.energy.value -= 5; // Decrease energy with each click
            updateProgress(progress);
            updateProgress(progresses.energy);
        }
    }

    function regenerateEnergy() {
        if (!gameActive) return;
        if (progresses.energy.value < 100) {
            progresses.energy.value += 5;
            updateProgress(progresses.energy);
        }
    }

    function resetGame() {
        gameActive = false; // Stop all game activities
    }

    function updateTimer() {
        if (!gameActive) return;
        timeElapsed++;
        document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    }

    progresses.clean.button.addEventListener('click', () => handleButtonClick(progresses.clean));
    progresses.feed.button.addEventListener('click', () => handleButtonClick(progresses.feed));
    progresses.pet.button.addEventListener('click', () => handleButtonClick(progresses.pet));

    let decreaseIntervalId = setInterval(decreaseProgresses, decreaseInterval);
    setInterval(updateTimer, 1000);
    setInterval(regenerateEnergy, 2000); // Regenerate energy every second

    // Initial update to set progress values
    updateProgress(progresses.clean);
    updateProgress(progresses.feed);
    updateProgress(progresses.pet);
    updateProgress(progresses.energy);