import React from 'react'

let urlMap = {
  "Gen": 'GN',
  "Exod": 'EX',
  "Lev": 'LV',
  "Num": 'NU',
  "Deut": 'DT',
  "Josh": 'JS',
  "Judg": 'JG',
  "Ruth": 'RT',
  "1 Sam": 'S1',
  "2 Sam": 'S2',
  "1 Kings": 'K1',
  "2 Kings": 'K2',
  "1 Chron": 'R1',
  "2 Chron": 'R2',
  "Ezra": 'ER',
  "Neh": 'NH',
  "Esther": 'ET',
  "Job": 'JB',
  "Ps": 'PS',
  "Prov": 'PR',
  "Eccles": 'EC',
  "Song": 'SS',
  "Isa": 'IS',
  "Jer": 'JR',
  "Lam": 'LM',
  "Ezek": 'EK',
  "Dan": 'DN',
  "Hos": 'HS',
  "Joel": 'JL',
  "Amos": 'AM',
  "Obad": 'OB',
  "Jonah": 'JH',
  "Micah": 'MC',
  "Nah": 'NM',
  "Hab": 'HK',
  "Zeph": 'ZP',
  "Haggai": 'HG',
  "Zech": 'ZC',
  "Mal": 'ML',
  "Matt": 'MT',
  "Mark": 'MK',
  "Luke": 'LK',
  "John": 'JN',
  "Acts": 'AC',
  "Rom": 'RM',
  "1 Cor": 'C1',
  "2 Cor": 'C2',
  "Gal": 'GL',
  "Eph": 'EP',
  "Phil": 'PP',
  "Col": 'CL',
  "1 Thess": 'H1',
  "2 Thess": 'H2',
  "1 Tim": 'T1',
  "2 Tim": 'T2',
  "Titus": 'TT',
  "Philem": 'PM',
  "Heb": 'HB',
  "James": 'JM',
  "1 Pet": 'P1',
  "2 Pet": 'P2',
  "1 John": 'J1',
  "2 John": 'J2',
  "3 John": 'J3',
  "Jude": 'JD',
  "Rev": 'RV'
}

// https://stackoverflow.com/a/47776379
function rafAsync() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve); //faster than set time out
  });
}

async function isRefTaggerLoaded() {
  while (window.refTagger.tag === undefined) {
    await rafAsync()
  }
  return true;
}


function morphBibleLinks(link) {
  let verseReference = link.getAttribute('data-reference');
  // console.log(verseReference)
  let lastSpaceRef = verseReference.lastIndexOf(' ')
  let book = verseReference.substring(0, lastSpaceRef)
  let chapterVerse = verseReference.substring(lastSpaceRef + 1)

  let lastDotRef = chapterVerse.lastIndexOf('.')
  let verse
  let chapter

  if (lastDotRef === -1) {
    verse = 1
    chapter = chapterVerse
  } else {
    chapter = chapterVerse.substring(0, lastDotRef)
    let lastDashRef = chapterVerse.lastIndexOf('-')

    if (lastDashRef === -1) {
      verse = chapterVerse.substring(lastDotRef + 1)
    } else {
      verse = chapterVerse.substring(lastDotRef + 1, lastDashRef)
    }
  }

  book = book.replace(/[^1-3a-z ]/gi, '')

  // console.log(book)
  // console.log(chapterVerse)
  // console.log(chapter)
  // console.log(verse)

  let newBookRef = urlMap[book]

  let newURL = `http://biblewebapp.com/study/?w1=bible&v1=${newBookRef}${chapter}_${verse}`

  let newLink = document.createElement('a');
  newLink.innerHTML = link.innerHTML;
  newLink.href = newURL
  newLink.target = '_blank';

  let parent = link.parentElement

  parent.insertBefore(newLink, link)
  link.remove()
}

function observeBibleLinks(mutationList, observer) {
  // console.log(mutationList)

  mutationList.forEach(mutation => {
    // console.log(mutation.type)
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          // console.log(node)
          let dataReference = node.getAttribute('data-reference')
          // console.log(dataReference)
          if (dataReference !== null) {
            morphBibleLinks(node)
            // console.log(node)
          }
        }
      })
    }
  });
}

// https://github.com/Faithlife/react-reftagger/blob/81e7868963972fcad4fcd828c345558c12750ce3/index.js

// Copyright (c) 2015, Mike Freyberger

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

class RefTagger extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (document.getElementById("refTagger") === null) {
      this.addScript();
    }
    this.update();
  }

  componentDidUpdate(prevProps, prevState) {
    this.update();
  }

  update() {
    isRefTaggerLoaded()
      .then(() => {
        window.refTagger.tag()

      });
  }

  addScript() {
    var observerOptions = {
      childList: true,
      attributes: true,
      subtree: true
    }
    var observer = new MutationObserver(observeBibleLinks);
    observer.observe(document.body, observerOptions);

    if (window.refTagger === undefined) {
      window.refTagger = {
        settings: {
          bibleVersion: "NASB",
          roundCorners: true,
          socialSharing: [],
          tagChapters: true,
          customStyle: {
            heading: {
              backgroundColor: "#28476b",
              color: "#ffffff"
            }
          }
        }
      };
    }

    var el, s;
    el = document.createElement('script');
    el.type = 'text/javascript';
    el.async = true;
    el.src = 'https://api.reftagger.com/v2/RefTagger.js';
    el.id = 'refTagger'
    s = document.getElementsByTagName('script')[0];
    return s.parentNode.insertBefore(el, s);
  }

  render() {
    return <div></div>;
  }
};

export default RefTagger