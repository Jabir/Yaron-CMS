// format the HTML output and source
FCKConfig.FormatOutput = true;
FCKConfig.FormatSource = true;

// ignore empty paragraphs
FCKConfig.IgnoreEmptyParagraphValue = true;

//don't put <p>&#160</p> all the time
FCKConfig.FillEmptyBlocks = false;

// don't process entities since we use UTF-8
FCKConfig.ProcessHTMLEntities = false;

// Enter triggers a new paragraph, Shift+Enter triggers line break (just like in most text processors)
FCKConfig.EnterMode = 'p';
FCKConfig.ShiftEnterMode = 'br';

// set a different plugins path so that we can update the editor independently
FCKConfig.PluginsPath = FCKConfig.BasePath + '../../fckeditor_plugins/';

// add our Cells plugin
FCKConfig.Plugins.Add('cells', 'en,de');

// table tools plugins
var originalPluginsPath = FCKConfig.BasePath + 'plugins/';
FCKConfig.Plugins.Add('tablecommands', null, originalPluginsPath);
FCKConfig.Plugins.Add('dragresizetable', null, originalPluginsPath);

// auto detect language
FCKConfig.AutoDetectLanguage = true;

// adva-cms default toolbar
FCKConfig.ToolbarSets['adva-cms'] = [
  ['Source','-','Save','Preview'],
  ['Cut','Copy','Paste','PasteText','PasteWord','-','Print'],
  ['Undo','Redo','-','Find','Replace','-','SelectAll'],
  '/',
  ['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
  ['OrderedList','UnorderedList','-','Outdent','Indent','Blockquote'],
  ['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
  ['Link','Unlink','Anchor', 'ConfigureCell'],
  ['Rule','SpecialChar'],
  ['TextColor','BGColor'],
  '/',
  ['Table', '-', 'TableInsertRowAfter', 'TableDeleteRows', '-',
    'TableInsertColumnAfter', 'TableDeleteColumns', '-',
    'TableInsertCellAfter', 'TableDeleteCells', '-',
    'TableMergeCells', 'TableHorizontalSplitCell', '-', 'TableCellProp']
];

// adva-cms minimum toolbar
FCKConfig.ToolbarSets['adva-cms-small'] = [
  ['Bold','Italic','StrikeThrough', '-', 'Link', 'Unlink']
];

FCKConfig.ToolbarSets['frontpage'] = [
  ['Bold','Italic','StrikeThrough','-','OrderedList','UnorderedList','-','Outdent','Indent','Blockquote','-','Link','Unlink','ImageButton']
];


// use custom stylesheet for editor
// FCKConfig.EditorAreaCSS = '/themes/a-theme/stylesheets/editor.css';
