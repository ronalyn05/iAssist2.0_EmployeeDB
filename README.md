
*** CREATING OWN BRANCH NAME ***
* git branch
* git branch branchNAME

*** PUSH TO OWN BRANCH ***
* git branch
* git checkout ownbranchNAME
* git add .
* git commit -m "message here"
* git push origin ownbranchNAME

*** MERGE OWN BRANCH TO MASTER ***
* git branch
* git checkout master
* git pull origin master
* git checkout ownbranchNAME
* git merge master
* git push origin ownbranchNAME:master

**IF CONFLICT (LIKE prompting you to enter a merge commit message) **

* press i
* type " Merge branch 'RONALYN' from remote repository "
* Esc
* Type :wq and press Enter to save and close the file (MERGE_MSG).
* then git push origin ownBranchName or ownBranchName:master


