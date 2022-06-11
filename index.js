$(function() {
  $('#ranzomize-chords-btn').click(function() {
    generateAndDisplayRandomSequence();
  });

  $('#pagination-back-btn').click(function() {
    storedIndex = storedIndex - CHORDS_PER_PAGE;
    displaySequence(storedRandomSequence, storedIndex);
  });

  $('#pagination-forward-btn').click(function() {
    storedIndex = storedIndex + CHORDS_PER_PAGE;
    displaySequence(storedRandomSequence, storedIndex);
  });

  // There are 12 sounds in equal temperment
  let notesBySound = ['A♭', 'A',
                      'B♭', 'B',
                      'C',
                      'D♭', 'D',
                      'E♭', 'E',
                      'F',
                      'G♭', 'G'];

  // There are 15 keys. 6 of the keys have overlapping values, meaning 3 are effectively dupes.
  let notesByKeys = ['A♭', 'A',
                     'B♭', 'B',
                     'C♭', 'C', 'C♯',
                     'D♭', 'D',
                     'E♭', 'E',
                     'F', 'F♯',
                     'G♭', 'G'];

  // There are 21 symbols. For example, Cb is B, and B# is C.
  let notesBySymbols = ['A', 'A♭', 'A♯',
                        'B', 'B♭', 'B♯',
                        'C', 'C♭', 'C♯',
                        'D', 'D♭', 'D♯',
                        'E', 'E♭', 'E♯',
                        'F', 'F♭', 'F♯',
                        'G', 'G♭', 'G♯'];

  // Enum like values to support chord modifier display inputs
  let CHORD_MODIFIER_DISPLAY_SYMBOLS = 'CHORD_MODIFIER_DISPLAY_SYMBOLS';
  let CHORD_MODIFIER_DISPLAY_LETTERS = 'CHORD_MODIFIER_DISPLAY_LETTERS';
  let CHORD_MODIFIER_DISPLAY_RANDOM = 'CHORD_MODIFIER_DISPLAY_RANDOM';

  let SEQUENCE_VALUE_SMALLER_TEXT_CLASS = 'sequence-value-smaller-text';

  let DISPLAY_ROW_COUNT = 4;
  let DISPLAY_COLUMN_COUNT = 4;
  let CHORDS_PER_PAGE = DISPLAY_ROW_COUNT * DISPLAY_COLUMN_COUNT;

  var storedRandomSequence = [];
  var storedIndex = 0;

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
      console.log('Warning: Unsupported Chord Modifier Display Type Selected.');
      alert('Warning: No Chord Display Type Selected');
    }

    // If the input selected was 'Random', we must randomize what we will use for this execution.
    if (chordModifierDisplayType === CHORD_MODIFIER_DISPLAY_RANDOM) {
      let displayTypeList = [CHORD_MODIFIER_DISPLAY_SYMBOLS, CHORD_MODIFIER_DISPLAY_LETTERS];
      chordModifierDisplayType = displayTypeList[Math.floor(Math.random() * displayTypeList.length)];
    }

    return chordModifierDisplayType;
  }

  function createSpanElement(textValue, classValue) {
    return $('<span \>', {
      text: textValue,
      class: classValue
    });
  }

  function createSuperscriptElement(textValue, classValue) {
    return $('<sup \>', {
      text: textValue,
      class: classValue
    });
  }

  function getChordModifiers() {
    var chordModifiers = [];

    let chordModifierDisplayType = getChordModifierDisplayType();

    // Triad Config Checks
    if (document.getElementById('major-triads-toggle').checked) {
      chordModifiers.push([createSpanElement('')]);
    }
    if (document.getElementById('minor-triads-toggle').checked) {
      if (CHORD_MODIFIER_DISPLAY_SYMBOLS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('-')]);
      } else if (CHORD_MODIFIER_DISPLAY_LETTERS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('m', SEQUENCE_VALUE_SMALLER_TEXT_CLASS)]);
      }
    }
    if (document.getElementById('augmented-triads-toggle').checked) {
      if (CHORD_MODIFIER_DISPLAY_SYMBOLS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('+')]);
      } else if (CHORD_MODIFIER_DISPLAY_LETTERS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('aug', SEQUENCE_VALUE_SMALLER_TEXT_CLASS)]);
      }
    }
    if (document.getElementById('diminished-triads-toggle').checked) {
      if (CHORD_MODIFIER_DISPLAY_SYMBOLS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('°')]);
      } else if (CHORD_MODIFIER_DISPLAY_LETTERS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('dim', SEQUENCE_VALUE_SMALLER_TEXT_CLASS)]);
      }
    }
    if (document.getElementById('sus4-triads-toggle').checked) {
      chordModifiers.push([createSuperscriptElement('sus')]);
    }
    if (document.getElementById('sus2-triads-toggle').checked) {
      chordModifiers.push([createSuperscriptElement('sus2')]);
    }

    // 7th Chord Config Checks
    if (document.getElementById('major-seventh-chords-toggle').checked) {
      if (CHORD_MODIFIER_DISPLAY_SYMBOLS === chordModifierDisplayType) {
        chordModifiers.push([createSuperscriptElement('△7')]);
      } else if (CHORD_MODIFIER_DISPLAY_LETTERS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('M', SEQUENCE_VALUE_SMALLER_TEXT_CLASS), createSuperscriptElement('7')]);
      }
    }
    if (document.getElementById('dominant-seventh-chords-toggle').checked) {
      chordModifiers.push([createSuperscriptElement('7')]);
    }
    if (document.getElementById('minor-seventh-chords-toggle').checked) {
      if (CHORD_MODIFIER_DISPLAY_SYMBOLS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('-'), createSuperscriptElement('7')]);
      } else if (CHORD_MODIFIER_DISPLAY_LETTERS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('m', SEQUENCE_VALUE_SMALLER_TEXT_CLASS), createSuperscriptElement('7')]);
      }
    }
    if (document.getElementById('diminished-seventh-chords-toggle').checked) {
      if (CHORD_MODIFIER_DISPLAY_SYMBOLS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('°'), createSuperscriptElement('7')]);
      } else if (CHORD_MODIFIER_DISPLAY_LETTERS === chordModifierDisplayType) {
        chordModifiers.push([createSpanElement('dim', SEQUENCE_VALUE_SMALLER_TEXT_CLASS), createSuperscriptElement('7')]);
      }
    }

    if (chordModifiers.length === 0) {
      // At least one chord configuration must be selected
      console.log('Warning: No Chords Selected');
      alert('Warning: No Chords Selected.');
      return;
    }

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
      console.log('Warning: Unsupported Note Pool Option Selected.');
      alert('Warning: No Notes Selected');
    }

    return notePool;
  }

  function generateAndDisplayRandomSequence() {
    var chordSequence = [];
    // Check if we are in flash card mode
    if (document.getElementById('flash-card-mode-toggle').checked) {
      // In flash card mode, we will generate all possible values, and each will be displayed exactly once.
      chordSequence = generateFlashCardSequence();
    } else {
      // In normal mode, we will generate a random set of chords, where duplicates are allowed in the sequence.
      chordSequence = generateNormalSequence();
    }

    // Store our sequence, and reset our index to 0.
    storedRandomSequence = chordSequence;
    storedIndex = 0;

    displaySequence(chordSequence, 0);
  }

  function generateNormalSequence() {
    let notePool = getNotePool();
    let chordModifiers = getChordModifiers();

    var chordSequence = [];
    for (var i=0; i < CHORDS_PER_PAGE; i++) {
      let chordValue = $('<td \>', {
        class: 'sequence-value',
        text: notePool[Math.floor(Math.random() * notePool.length)]
        });

      let chordModifierGroup = chordModifiers[Math.floor(Math.random() * chordModifiers.length)];
      for (let i = 0; i < chordModifierGroup.length; i++) {
        // Appended elements must be unique, or else they are just moved. Cloning before appending.
        chordValue.append(chordModifierGroup[i][0].cloneNode(true));
      }

      chordSequence.push(chordValue);
    }
    return chordSequence;
  }

  function generateFlashCardSequence() {
    let notePool = getNotePool();
    let chordModifiers = getChordModifiers();

    var chordSequence = [];
    for (var i = 0; i < notePool.length; i++) {
      for (var j = 0; j < chordModifiers.length; j++) {
        let chordValue = $('<td \>', {
          class: 'sequence-value',
          text: notePool[i]
          });

        let chordModifierGroup = chordModifiers[j];
        for (let k = 0; k < chordModifierGroup.length; k++) {
          // Appended elements must be unique, or else they are just moved. Cloning before appending.
          chordValue.append(chordModifierGroup[k][0].cloneNode(true));
        }

        chordSequence.push(chordValue);
      }
    }

    // Since we generated the sequence in order, we need to shuffle before returning.
    chordSequence = shuffle(chordSequence);

    return chordSequence;
  }

  // TODO: Remove this function
  function displaySequence(chordSequence, startIndex) {
    if (chordSequence.length > CHORDS_PER_PAGE) {
      // Display page count
      let currentPageNumber = Math.floor(startIndex / CHORDS_PER_PAGE) + 1;
      let totalPageCount = Math.ceil(chordSequence.length / CHORDS_PER_PAGE);
      $('#pagination-page-text').text('Page ' + currentPageNumber + ' of ' + totalPageCount);

     // If we are on the first page, deactivate the back button
     if (currentPageNumber == 1) {
       $('#pagination-back-btn').attr('disabled', true);
     } else {
       $('#pagination-back-btn').attr('disabled', false);
     }

     // If we are on the last page, deactivate the forward button
     if (currentPageNumber == totalPageCount) {
       $('#pagination-forward-btn').attr('disabled', true);
     } else {
       $('#pagination-forward-btn').attr('disabled', false);
     }

      // Display Pagination Controls
      $('#pagination-controls').show();

    } else {
      // Hide Pagination Controls
      $('#pagination-controls').hide();
    }

    // Clearing currently displayed sequence
    let sequenceDisplaySection = $('#sequence-display-section');
    sequenceDisplaySection.empty();

    chordSequenceIndex = startIndex;

    for (var i=0; i < DISPLAY_ROW_COUNT; i++) {
      let sequenceRow = $('<tr \>', {
        class: 'sequence-row'
      });
      sequenceDisplaySection.append(sequenceRow);

      for (var j=0; j < DISPLAY_COLUMN_COUNT; j++) {
        if (chordSequenceIndex < chordSequence.length) {
          sequenceRow.append(chordSequence[chordSequenceIndex]);
          chordSequenceIndex++;
        } else {
          // To maintain the structure of the page, we will add hidden values when our sequence is complete.
          let emptyValue = $('<td \>', {
            class: 'sequence-value empty-sequence-value',
            text: 'X'
            });
          sequenceRow.append(emptyValue)
        }
      }
    }
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

  generateAndDisplayRandomSequence();
});
