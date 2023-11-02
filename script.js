document.getElementById('trigger').addEventListener('click', function() {
    // Activate State 1
    var state1 = document.getElementById('state1');
    var state2 = document.getElementById('state2');
    var arrowhead = document.getElementById('arrowhead-1-2');

    // Reset animation if it's already been run
    state1.classList.remove('active');
    state2.classList.remove('active');
    arrowhead.style.transform = 'translateX(0)';

    // Trigger reflow to restart the animation
    void state1.offsetWidth;
    void arrowhead.offsetWidth;

    // Add the 'active' class to state 1 and animate the arrowhead
    state1.classList.add('active');
    setTimeout(function() {
        state2.classList.add('active');
        arrowhead.style.transform = 'translateX(200px)';
    }, 500);
});

