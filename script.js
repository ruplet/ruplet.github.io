// document.getElementById('trigger').addEventListener('click', function() {
//     // Activate State 1
//     var state1 = document.getElementById('state1');
//     var state2 = document.getElementById('state2');
//     var arrowhead = document.getElementById('arrowhead-1-2');

//     // Reset animation if it's already been run
//     state1.classList.remove('active');
//     state2.classList.remove('active');
//     arrowhead.style.transform = 'translateX(0)';

//     // Trigger reflow to restart the animation
//     void state1.offsetWidth;
//     void arrowhead.offsetWidth;

//     // Add the 'active' class to state 1 and animate the arrowhead
//     state1.classList.add('active');
//     setTimeout(function() {
//         state2.classList.add('active');
//         arrowhead.style.transform = 'translateX(200px)';
//     }, 500);
// });

// // Define the animation sequence for the finite automata
// function animateFA() {
//     const state1 = document.getElementById('state1');
//     const state2 = document.getElementById('state2');
//     const arrow = document.getElementById('arrow');
    
//     // Add the 'active' class to state1 to highlight it
//     state1.classList.add('active');
  
//     // Make the arrow visible
//     arrow.classList.add('visible');
  
//     // Animate the arrow from state1 to state2
//     setTimeout(() => {
//       arrow.style.transform = 'translateX(150px)';
//     }, 500);
  
//     // After the arrow animation, activate state2 and reset
//     setTimeout(() => {
//       state1.classList.remove('active');
//       state2.classList.add('active');
//       arrow.classList.remove('visible');
//       arrow.style.transform = 'translateX(0)';
      
//       // Continue the animation with some delay
//       setTimeout(animateFA, 1000);
//     }, 1000);
//   }
  
//   // Start the animation
//   animateFA();
  

