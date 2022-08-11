let no_sidebar = false;
let no_numbers = false;
let no_prompt = false;

chrome.storage.local.get('noSidebar', (data) => {
  console.log('noSidebar', data.noSidebar);
  no_sidebar = data.noSidebar;
});

chrome.storage.local.get('noNumbers', (data) => {
  console.log('noNumbers', data.noNumbers);
  no_numbers = data.noNumbers;
});

chrome.storage.local.get('noPrompt', (data) => {
  console.log('noPrompt', data.noPrompt);
  no_prompt = data.noPrompt;
});

const checkIfNumber = (val) => {
  let isNum = /^\d+$/.test(val);
  let isThousand = /^\d+(\.\d+)?K+$/.test(val);
  let isMillion = /^\d+(\.\d+)?M+$/.test(val);
  let hasComma = /^\d{1,3}(,\d{3})*(\.\d+)?$/.test(val);
  return isNum || isThousand || isMillion || hasComma;
};

const beginCleanup = (no_sidebar, no_numbers, no_prompt) => {
  // console.log('Beginning cleanup');

  var sideBar = document.querySelector('[aria-label="Trends"]');

  var innerSidebar = null;

  if (sideBar != null) {
    var sideBarChildren = sideBar.children;
    if (sideBarChildren != null && sideBarChildren.length >= 0) {
      innerSidebar = sideBarChildren.item(0);
    }
  }

  if (no_sidebar) {
    if (innerSidebar != null) {
      if (innerSidebar.children.length >= 4) {
        var relevantPeople = innerSidebar.children.item(3);

        if (relevantPeople != null) {
          var innerRelevantChildren = relevantPeople.children;

          if (innerRelevantChildren != null && innerRelevantChildren.length >= 1) {
            var innerRelevantChild = innerRelevantChildren.item(0);

            if (innerRelevantChild != null && innerRelevantChild.tagName == 'ASIDE') {
              relevantPeople.remove();
              deletedRelevantPeople = true;
            }
          }
        }
      }

      if (innerSidebar.children.length >= 4) {
        var trendsForYou = innerSidebar.children.item(3);

        if (trendsForYou != null) {
          var innertrendsForYouChildren = trendsForYou.children;

          if (innertrendsForYouChildren != null && innertrendsForYouChildren.length >= 1) {
            var innertrendsForYouChild = innertrendsForYouChildren.item(0);

            if (innertrendsForYouChild != null) {
              if (innertrendsForYouChild.children.length >= 1) {
                var innerTrendsForYouChild2 = innertrendsForYouChild.children.item(0);
                if (innerTrendsForYouChild2 != null && innerTrendsForYouChild2.tagName == 'SECTION') {
                  trendsForYou.remove();
                }
              }
            }
          }
        }
      } else {
        if (innerSidebar.children.length >= 5) {
          var trendsForYou = innerSidebar.children.item(4);

          if (trendsForYou != null) {
            var innertrendsForYouChildren = trendsForYou.children;
  
            if (innertrendsForYouChildren != null && innertrendsForYouChildren.length >= 1) {
              var innertrendsForYouChild = innertrendsForYouChildren.item(0);
  
              if (innertrendsForYouChild != null) {
                if (innertrendsForYouChild.children.length >= 1) {
                  var innerTrendsForYouChild2 = innertrendsForYouChild.children.item(0);
                  if (innerTrendsForYouChild2 != null && innerTrendsForYouChild2.tagName == 'SECTION') {
                    trendsForYou.remove();
                  }
                }
              }
            }
          }
        }
      }
    }

    removeFooter();
  }

  if (no_numbers) {
    removeNumbers();
  }
  
  if (no_prompt) {
    var layerDiv = document.getElementById('layers')
    
    if (layerDiv != null) {
      var loginBar = layerDiv.querySelector('[data-testid="BottomBar"]');
      
      if (loginBar != null) {
        loginBar.remove();
      }

      var loginPrompt = layerDiv.querySelector('[data-testid="sheetDialog"]');
      if (loginPrompt != null) {
        var loginPromptParent = loginPrompt.parentElement;
        if (loginPromptParent != null) {
          loginPromptParent.remove();
        }
      }
    }

    if (innerSidebar != null && innerSidebar.children.length >= 2) {
      var registerPrompt = innerSidebar.children.item(2);

      if (registerPrompt != null) {
        var innerChildren = registerPrompt.children;

        if (innerChildren != null && innerChildren.length >= 1) {
          var innerChild = innerChildren.item(0);

          if (innerChild != null && innerChild.tagName == 'SECTION') {
            registerPrompt.remove();
          }
        }
      }
    }
    document.querySelector('html').style.overflow = 'scroll';
  }
};

new MutationObserver(() => {
  onDOMChange();
}).observe(document, { subtree: true, childList: true });

function onDOMChange() {
  beginCleanup(no_sidebar, no_numbers, no_prompt);
}

document.onload = beginCleanup(no_sidebar, no_numbers, no_prompt);

const removeSection = (treeStructure, targetText) => {
  const span = $(`span:contains('${targetText}')`);

  let iterator = span;

  // console.log('Itr before loop', iterator);

  for (let el of treeStructure) {
    iterator = iterator.parent(el);
  }

  // console.log('Itr after loop completion', iterator);

  iterator.remove();
};

const removeNumbers = () => {
  const likesEl = $(
    '.css-901oao, .css-16my406, .r-poiln3, .r-bcqeeo, .r-qvutc0'
  );

  for (let item of likesEl) {
    const { nodeName: tag } = item;

    if (tag === 'SPAN') {
      const innerText = $(item).html();

      if (checkIfNumber(innerText)) {
        // TODO: Also handle numbers with suffixes like K, M (eg. 100k, 1M)
        item.remove();
      }
    }
  }
};

const removeFooter = () => {
  const navElement = $('[aria-label=Footer]');

  navElement.remove();
};
