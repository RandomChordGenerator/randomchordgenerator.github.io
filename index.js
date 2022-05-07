$(function() {
  $('#ranzomize-chords-btn').click(function() {
    displayRandomSequence();
  });

  // There are 12 sounds in equal temperment
  let notesBySound = ["A♭", "A",
                      "B♭", "B",
                      "C",
                      "D♭", "D",
                      "E♭", "E",
                      "F",
                      "G♭", "G"];

  // There are 15 keys. 6 of the keys have overlapping values, meaning 3 are effectively dupes.
  let notesByKeys = ["A♭", "A",
                     "B♭", "B",
                     "C♭", "C", "C♯",
                     "D♭", "D",
                     "E♭", "E",
                     "F", "F♯",
                     "G♭", "G"];

  // There are 21 symbols. For example, Cb is B, and B# is C.
  let notesBySymbols = ["A", "A♭", "A♯",
                        "B", "B♭", "B♯",
                        "C", "C♭", "C♯",
                        "D", "D♭", "D♯",
                        "E", "E♭", "E♯",
                        "F", "F♭", "F♯",
                        "G", "G♭", "G♯"];

  // Enum like values to support chord modifier display inputs
  let CHORD_MODIFIER_DISPLAY_SYMBOLS = 'CHORD_MODIFIER_DISPLAY_SYMBOLS';
  let CHORD_MODIFIER_DISPLAY_LETTERS = 'CHORD_MODIFIER_DISPLAY_LETTERS';
  let CHORD_MODIFIER_DISPLAY_RANDOM = 'CHORD_MODIFIER_DISPLAY_RANDOM';

  function getChordModifierDisplayType() {
    var chordModifierDisplayType;

    if (document.getElementById('chord-modifier-display-symbols').classList.contains('active')) {
      chordModifierDisplayType = CHORD_MODIFIER_DISPLAY_SYMBOLS.slice()
    } else if (document.getElementById('chord-modifier-display-letters').classList.contains('active')) {
      chordModifierDisplayType = CHORD_MODIFIER_DISPLAY_LETTERS.slice()
    } else if (document.getElementById('chord-modifier-display-random').classList.contains('active')) {
      chordModifierDisplayType = CHORD_MODIFIER_DISPLAY_RANDOM.slice()
    } else {
      // The only way this should be reached is if a new option was added, but this method was not updated.
      console.log("Unsupported Chord Modifier Display Type Selected.")
      alert("Warning: No Chord Display Type Selected")
    }

    // Log the input selected in config to help debugging
    console.log('Chord Modifier Display Type Selected: ');
    console.log(chordModifierDisplayType);

    // If the input selected was "Random", we must randomize what we will use for this execution.
    if (chordModifierDisplayType === CHORD_MODIFIER_DISPLAY_RANDOM) {
      let displayTypeList = [CHORD_MODIFIER_DISPLAY_SYMBOLS, CHORD_MODIFIER_DISPLAY_LETTERS];
      chordModifierDisplayType = displayTypeList[Math.floor(Math.random() * displayTypeList.length)];
      console.log('Randomizing Chord Modifier Display Type: ' + chordModifierDisplayType);
    }

    return chordModifierDisplayType;
  }

  function getChordModifiers() {
    var chordModifiers = [];

    let chordModifierDisplayType = getChordModifierDisplayType();

    // Triad Config Checks
    if (document.getElementById('major-triads-toggle').checked) {
      chordModifiers = chordModifiers.concat('');
    }
    if (document.getElementById('minor-triads-toggle').checked) {
      let displayOptions = {
        CHORD_MODIFIER_DISPLAY_SYMBOLS: {
          value: '-',
          superscript: false},
        CHORD_MODIFIER_DISPLAY_LETTERS: {
          value: 'm',
          superscript: false},
      };
      chordModifiers = chordModifiers.concat(displayOptions[chordModifierDisplayType]);
    }
    if (document.getElementById('augmented-triads-toggle').checked) {
      let displayOptions = {
        CHORD_MODIFIER_DISPLAY_SYMBOLS: {
          value: '+',
          superscript: false},
        CHORD_MODIFIER_DISPLAY_LETTERS: {
          value: 'aug',
          superscript: false},
      };
      chordModifiers = chordModifiers.concat(displayOptions[chordModifierDisplayType]);
    }
    if (document.getElementById('diminished-triads-toggle').checked) {
      let displayOptions = {
        CHORD_MODIFIER_DISPLAY_SYMBOLS: {
          value: '°',
          superscript: false},
        CHORD_MODIFIER_DISPLAY_LETTERS: {
          value: 'dim',
          superscript: false},
      };
      chordModifiers = chordModifiers.concat(displayOptions[chordModifierDisplayType]);
    }
    if (document.getElementById('sus4-triads-toggle').checked) {
      chordModifiers = chordModifiers.concat({
        value: 'sus',
        superscript: true});
    }
    if (document.getElementById('sus2-triads-toggle').checked) {
      chordModifiers = chordModifiers.concat({
        value: 'sus2',
        superscript: true});
    }

    // 7th Chord Config Checks
    if (document.getElementById('major-seventh-chords-toggle').checked) {
      // TODO: Update to support letter based display.
      chordModifiers = chordModifiers.concat('△7');
      chordModifiers = chordModifiers.concat({
        value: '△7',
        superscript: true});
    }
    if (document.getElementById('dominant-seventh-chords-toggle').checked) {
      chordModifiers = chordModifiers.concat({
        value: '7',
        superscript: true});
    }
    if (document.getElementById('minor-seventh-chords-toggle').checked) {
      // TODO: Update to support letter based display.
      // TODO: Update superscript logic, such that we can remove hacky characters.
      chordModifiers = chordModifiers.concat({
        value: '_7',
        superscript: true});
    }
    if (document.getElementById('diminished-seventh-chords-toggle').checked) {
      // TODO: Update to support letter based display.
      // TODO: Update superscript logic, such that we can remove hacky characters.
      chordModifiers = chordModifiers.concat('o7');
      chordModifiers = chordModifiers.concat({
        value: 'o7',
        superscript: true});
    }

    // Log the input selected in config to help debugging
    console.log('Chord Modifiers Selected: ');
    console.log(chordModifiers);

    return chordModifiers;
  }

  function getNotePool(decoration) {
    var notePool;
    if (document.getElementById('note-pool-12-radio').classList.contains('active')) {
      notePool = Array.from(notesBySound);
    } else if (document.getElementById('note-pool-15-radio').classList.contains('active')) {
      notePool = Array.from(notesByKeys);
    } else if (document.getElementById('note-pool-21-radio').classList.contains('active')) {
      notePool = Array.from(notesBySymbols);
    } else {
      // The only way this should be reached is if a new option was added, but this method was not updated.
      console.log("Unsupported Note Pool Option Selected.")
      alert("Warning: No Notes Selected")
    }

    // Log the input selected in config to help debugging
    console.log('Note Pool Selected: ');
    console.log(notePool);

    return notePool;
  }

  function displayRandomSequence() {
    let notePool = getNotePool();
    let chordModifiers = getChordModifiers();

    if (chordModifiers.length === 0) {
      // At least one chord configuration must be selected
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
            text: notePool[Math.floor(Math.random() * notePool.length)]
          });
          sequenceRow.append(chordValue);

          let chordModifier = chordModifiers[Math.floor(Math.random() * chordModifiers.length)];
          var chordModifierElement;
          if (chordModifier.superscript) {
            chordModifierElement = "<sup \>";
          } else {
            chordModifierElement = "<span \>";
          }
          let chordModifierValue = $(chordModifierElement, {
            text: chordModifier.value
          });
          chordValue.append(chordModifierValue);
        }
      }
    }
  }

  displayRandomSequence();
});
