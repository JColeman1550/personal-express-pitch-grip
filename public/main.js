var trash = document.getElementsByClassName('deleteButton');
var editButtons = document.getElementsByClassName('editButton');
var addNoteButton = document.getElementById('add-note-button');
var noteForm = document.getElementById('note-form');

// Handle delete functionality
Array.from(trash).forEach(function(button) {
  button.addEventListener('click', function() {
    const noteId = button.getAttribute('data-id');
    
    fetch('/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: noteId })
    })
    .then(response => {
      if (response.ok) {
        console.log('Note deleted!');
        window.location.reload();
      } else {
        console.error('Failed to delete note.');
      }
    })
    .catch(error => console.error('Error:', error));
  });
});

// Handle edit functionality
Array.from(editButtons).forEach(function(button) {
  button.addEventListener('click', function() {
    const noteId = button.getAttribute('data-id');
    const noteElement=button.closest(".note") 
   // Safely retrieve the current values from the note
   const currentTitle = noteElement.querySelector('.note-title') ? noteElement.querySelector('.note-title').innerText : '';
   const currentDescription = noteElement.querySelector('.note-description') ? noteElement.querySelector('.note-description').innerText : '';
   const currentHandedness = noteElement.querySelector('.note-handedness') ? noteElement.querySelector('.note-handedness').innerText : '';
   const currentArmSlot = noteElement.querySelector('.note-armSlot') ? noteElement.querySelector('.note-armSlot').innerText : '';
    
    
      

    const newTitle = prompt("Enter new title:", currentTitle);
    const newDescription = prompt("Enter new description:", currentDescription);
    const newHandedness = prompt("Enter new handedness:", currentHandedness);
    const newArmSlot = prompt("Enter new arm slot:", currentArmSlot);

    if (newTitle != currentTitle || newDescription !=  currentDescription || newArmSlot !=  currentArmSlot || newHandedness !=  currentHandedness) {
      fetch('/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: noteId,
          title: newTitle,
          description: newDescription,
          handedness: newHandedness,
          armSlot: newArmSlot
        })
      })
      .then(response => {
        if (response.ok) {
          console.log('Note updated successfully!');
          window.location.reload();
        } else {
          console.error('Failed to update note.');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });
});

// Show form to add a new note
if (addNoteButton) {
  addNoteButton.addEventListener('click', function() {
    noteForm.style.display = 'block';
  });
}

// Handle form submission for adding a new note
if (noteForm) {
  noteForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('note-title').value;
    const description = document.getElementById('note-description').value;
    const handedness = document.getElementById('handedness').value;
    const armSlot = document.getElementById('arm-slot').value;

    fetch('/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, handedness, armSlot })
    })
    .then(response => {
      if (response.ok) {
        console.log('Note added successfully!');
        window.location.reload();
      } else {
        console.error('Failed to add note.');
      }
    })
    .catch(error => console.error('Error:', error));
  });
}
