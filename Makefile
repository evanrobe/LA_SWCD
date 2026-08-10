.PHONY: run

.ONESHELL:
SHELL := /bin/bash

export PATH := $(HOME)/.dotnet:$(HOME)/.local/node/bin:$(HOME)/.local/usr/bin:$(PATH)

API_DIR := API/src/LASWCD.WebApi
FRONTEND_DIR := FrontEnd

BACKEND_URL := http://localhost:5240
DEFAULT_FRONTEND_URL := http://localhost:5173

BACKEND_LOG := /tmp/laswcd-backend.log
FRONTEND_LOG := /tmp/laswcd-frontend.log
BACKEND_PID_FILE := /tmp/laswcd-backend.pid
FRONTEND_PID_FILE := /tmp/laswcd-frontend.pid

# Brings up the API, the React dev server, and opens a browser to the homepage.
# Ctrl+C stops both servers.
run:
	set -m
	rm -f $(BACKEND_LOG) $(FRONTEND_LOG) $(BACKEND_PID_FILE) $(FRONTEND_PID_FILE)

	trap ' \
		echo; \
		echo "==> Shutting down..."; \
		[ -f $(BACKEND_PID_FILE) ] && kill -- -$$(cat $(BACKEND_PID_FILE)) 2>/dev/null; \
		[ -f $(FRONTEND_PID_FILE) ] && kill -- -$$(cat $(FRONTEND_PID_FILE)) 2>/dev/null; \
		rm -f $(BACKEND_PID_FILE) $(FRONTEND_PID_FILE); \
		exit 0 \
	' INT TERM

	echo "==> Starting backend (LASWCD.WebApi) on $(BACKEND_URL)..."
	( cd $(API_DIR) && exec dotnet run --launch-profile http > $(BACKEND_LOG) 2>&1 ) &
	echo $$! > $(BACKEND_PID_FILE)

	echo "==> Starting frontend (Vite dev server)..."
	( cd $(FRONTEND_DIR) && exec ./node_modules/.bin/vite > $(FRONTEND_LOG) 2>&1 ) &
	echo $$! > $(FRONTEND_PID_FILE)

	echo "==> Waiting for backend to respond..."
	for i in $$(seq 1 60); do
		curl -s -o /dev/null "$(BACKEND_URL)/api/v1/characters/search" && break
		sleep 1
	done

	echo "==> Waiting for frontend to respond..."
	FRONTEND_URL=""
	for i in $$(seq 1 60); do
		FRONTEND_URL=$$(grep -oE 'http://localhost:[0-9]+' $(FRONTEND_LOG) 2>/dev/null | head -n1)
		[ -n "$$FRONTEND_URL" ] && break
		sleep 1
	done
	[ -z "$$FRONTEND_URL" ] && FRONTEND_URL="$(DEFAULT_FRONTEND_URL)"

	echo "==> Opening browser at $$FRONTEND_URL"
	( xdg-open "$$FRONTEND_URL" 2>/dev/null \
		|| open "$$FRONTEND_URL" 2>/dev/null \
		|| wslview "$$FRONTEND_URL" 2>/dev/null \
		|| echo "Could not auto-open a browser. Please open $$FRONTEND_URL manually." )

	echo "==> Backend running (PID $$(cat $(BACKEND_PID_FILE))) — log: $(BACKEND_LOG)"
	echo "==> Frontend running (PID $$(cat $(FRONTEND_PID_FILE))) — log: $(FRONTEND_LOG)"
	echo "==> Press Ctrl+C to stop both servers."

	wait
