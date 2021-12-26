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

    // Triad Config Checks
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

    // 7th Chord Config Checks
    if (document.getElementById('major-seventh-chords-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes('△7'));
    }
    if (document.getElementById('dominant-seventh-chords-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes('7'));
    }
    if (document.getElementById('minor-seventh-chords-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes('-7'));
    }
    if (document.getElementById('diminished-seventh-chords-toggle').checked) {
      chordPool = chordPool.concat(getDecoratedNotes('o7'));
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

    if (chordPool.length === 0) {
      console.log("Warning: No Chords Selected");
      alert("No Chords Selected.")
    } else {
      // Clearing currently displayed sequence
      let sequenceDisplaySection = $("#sequence-display-section");
      sequenceDisplaySection.empty();

      for (var i=0; i < 4; i++) {
        let sequenceRow = $("<tr \>", {
          class: 'sequence-row'
        });
        sequenceDisplaySection.append(sequenceRow);

        for (var j=0; j < 4; j++) {
          let chordValue = $("<td \>", {
            class: 'sequence-value',
            text: getRandomChord(chordPool)
          });
          sequenceRow.append(chordValue);
        }
      }
    }
  }

  displayRandomSequence();
});
