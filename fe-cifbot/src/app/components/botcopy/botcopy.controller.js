/* @ngInject */
class BotcopyCtrl {

  constructor () {
  /*  <script type="text/javascript"
      id="botcopy-embedder-d7lcfheammjct"
      class="botcopy-embedder-d7lcfheammjct"
      data-botId="5e365f791b973747c59a4489"
  ></script>*/
    var s = document.createElement('script');
    s.type = 'text/javascript'; s.async = true;
    s.src = 'https://widget.botcopy.com/js/injection.js';
    document.getElementById('botcopy-embedder-d7lcfheammjct').appendChild(s);
  }
}

export default BotcopyCtrl;