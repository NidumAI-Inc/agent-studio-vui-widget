import MarkdownPreview from '@uiw/react-markdown-preview';

function MarkdownParse({ response = "" }) {
  return (
    <MarkdownPreview
      source={response}
      style={{ background: "transparent", fontSize: ".7rem", color: "#141414" }}
      className='[&_ul]:list-decimal [&_ol]:list-decimal [&_ul]:list-inside [&_ol]:list-inside'
      wrapperElement={{
        'data-color-mode': "light"
      }}
    />
  )
}

export default MarkdownParse
