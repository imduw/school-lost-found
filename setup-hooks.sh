#!/usr/bin/env bash
# Chay 1 lan sau khi clone repo ve may:
#   bash setup-hooks.sh
# De kich hoat bo git hooks dung chung cho ca team.

set -e

cd "$(git rev-parse --show-toplevel)"

git config core.hooksPath .githooks
chmod +x .githooks/* 2>/dev/null || true

echo "Da kich hoat git hooks (core.hooksPath = .githooks)."
echo "Tu gio moi lan commit/push se duoc kiem tra tu dong."
