.PHONY: dev stop editor site

dev:
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	@pnpm dev & echo $$! > .pid.site
	@pnpm editor & echo $$! > .pid.editor

stop:
	@[ -f .pid.site ] && kill $$(cat .pid.site) && rm .pid.site || true
	@[ -f .pid.editor ] && kill $$(cat .pid.editor) && rm .pid.editor || true
	@echo "Stopped."

editor:
	@pnpm editor

site:
	@pnpm dev
