#!/bin/bash
# Runs before every rules deploy from this folder (firebase.json, predeploy).
# This ruleset is the-equal-lens's whole database: deployed to any other
# project, such as praxis-2ffa8, it would replace that project's rules.
if [ "$GCLOUD_PROJECT" != "the-equal-lens" ]; then
  echo "deploy-guard: this ruleset is for the-equal-lens only, not ${GCLOUD_PROJECT:-an unnamed project}" >&2
  exit 1
fi
