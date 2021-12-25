$(document).ready(function() {
  $('#ranzomize-chords-btn').click(function() {
    displayRandomSequence();
  });

  let notesBySound = ["A♭", "A",
                "B♭", "B",
                "C",
                "D♭", "D",
                "E♭", "E",
                "F",
                "G♭", "G"];

  function getChordPool() {
    var chordPool = [];

    if (document.getElementById('major-triads-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes(''));
    }
    if (document.getElementById('minor-triads-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes('m'));
    }
    if (document.getElementById('augmented-triads-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes('+'));
    }
    if (document.getElementById('diminished-triads-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes('o'));
    }

    console.log(chordPool);

    return chordPool;
  }

  function getDecoratedNotes(decoration) {
    let decoratedNotes = [];
    notesBySound.forEach(function(value, index, array) {
        decoratedNotes.push(value + decoration);
    });
    return decoratedNotes;
  }

  function getRandomChord(chordPool) {
    return chordPool[Math.floor(Math.random() * chordPool.length)]
  }

  function displayRandomSequence() {
    let chordPool = getChordPool();

    // Clearing currently displayed sequence
    let sequenceDisplaySection = $("#sequence-display-section");
    sequenceDisplaySection.empty();

    if (chordPool.length === 0) {
      console.log("Warning: No Chords Selected");
      let noChordsSelectedMessage = $("<div \>", {
        class: 'h1',
        text: 'No Chords Selected'
      });
      sequenceDisplaySection.append(noChordsSelectedMessage);
    } else {
      for (var i=0; i < 4; i++) {
        let sequenceRow = $("<div \>", {
          class: 'sequence-row'
        });
        sequenceDisplaySection.append(sequenceRow);

        for (var j=0; j < 4; j++) {
          let chordValue = $("<div \>", {
            class: 'sequence-value h1',
            text: getRandomChord(chordPool)
          });
          sequenceRow.append(chordValue);
        }
      }
    }
  }

  displayRandomSequence();
});
