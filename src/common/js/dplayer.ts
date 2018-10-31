export function renderDPlayer(el: any) {
  el.querySelectorAll('div.dplayer script').forEach((script: Element) => {
    /* tslint:disable:no-eval */
    eval(script.innerHTML);
  });
}
