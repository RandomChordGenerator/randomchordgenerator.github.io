$(function() {
  /**
   * Listener for the randomize button.
   */
  $('#ranzomize-chords-btn').click(function() {
    generateAndDisplayRandomSequence();
  });

  /**
   * Listener for the back pagination button.
   */
  $('#pagination-back-btn').click(function() {
    paginateBack();

  });

  /**
   * Listener for the forward pagination button.
   */
  $('#pagination-forward-btn').click(function() {
    paginateForward();
  });

  /**
   * Listener for the display area, which will be used for pagination.
   * If the chord display area is clicked/touched, we will attempt to paginate forwards or backwards depending on
   * which side has been interacted with.
   */
  $('#randomizer-display-panel').click(function(e) {
    var pWidth = $(this).innerWidth();
    var pOffset = $(this).offset();
    var x = e.pageX - pOffset.left;
    if((pWidth / 2) > x) {
      paginateBack();
    } else {
      paginateForward();
    }
  });

  let PAGINATION_INDICATOR_DELAY = 100;

  /**
   * If the displayed sequence exceeds the page size, and we are not on the first page, this function will perform
   * a backward pagination.
   */
  function paginateBack() {
    let newIndex = storedIndex - CHORDS_PER_PAGE;
    if (newIndex >= 0) {
      $('#randomizer-pagination-overlay-back').stop().clearQueue().fadeIn(PAGINATION_INDICATOR_DELAY).fadeOut();
      storedIndex = newIndex;
      displaySequence(storedRandomSequence, storedIndex);
    }
  }

  /**
   * If the displayed sequence exceeds the page size, and we are not on the last page, this function will perform
   * a forward pagination.
   */
  function paginateForward() {
    let newIndex = storedIndex + CHORDS_PER_PAGE;
    if (newIndex < storedRandomSequence.length) {
      $('#randomizer-pagination-overlay-forward').stop().clearQueue().fadeIn(PAGINATION_INDICATOR_DELAY).fadeOut();
      storedIndex = newIndex;
      displaySequence(storedRandomSequence, storedIndex);
    }
  }

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

  // Enum-like values to support chord modifier display inputs
  let CHORD_MODIFIER_DISPLAY_SYMBOLS = 'CHORD_MODIFIER_DISPLAY_SYMBOLS';
  let CHORD_MODIFIER_DISPLAY_LETTERS = 'CHORD_MODIFIER_DISPLAY_LETTERS';
  let CHORD_MODIFIER_DISPLAY_RANDOM = 'CHORD_MODIFIER_DISPLAY_RANDOM';

  let SEQUENCE_VALUE_SMALLER_TEXT_CLASS = 'sequence-value-smaller-text';

  let DISPLAY_ROW_COUNT = 4;
  let DISPLAY_COLUMN_COUNT = 4;
  let CHORDS_PER_PAGE = DISPLAY_ROW_COUNT * DISPLAY_COLUMN_COUNT;

  var storedRandomSequence = [];
  var storedIndex = 0;

  /**
   * Checks the Chord Modifier Display Type input, and returns an enum-like value representing the input.
   */
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
      alert('No Chord Display Type Selected. Please select a Chord Modifier Display Type.');
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

  /**
   * Checks the triad/chord inputs, and constructs/returns the corresponding chord modifiers.
   */
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
      alert('No Chords Selected. Please enable at least 1 triad/chord set.');
      return;
    }

    return chordModifiers;
  }

  /**
   * Checks for the note pool input, and fetches the corresponding note pool list.
   */
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
      alert('No notes selected. Please select a set of notes from the Note Pool Selector.');
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

  /**
   * Generates a sequence of chords, where the number is equal to what can be displayed on one page.
   * Duplicate chords can exist in the returned sequence.
   */
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

  /**
   * Generates a sequence of chords, where each combination of note and chord modifier has been enumerated.
   * The size of the set will increase as the number of modifiers requested increases.
   * The returned sequence will be in random order and will have no duplicate values.
   */
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

  /**
   * Displays the given sequence starting at the specified index.
   * This function will enable and update pagination controls if the number in the set exceeds the page size.
   */
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
