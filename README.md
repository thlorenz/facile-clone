# facile-clone [![build status](https://secure.travis-ci.org/thlorenz/facile-clone.png)](http://travis-ci.org/thlorenz/facile-clone)

Creates a shallow clone of an object, focusing on primitives and omitting or clipping large values.

```js
const facileClone = require('./')

const o = {
    num: 1
  , bool: true
  , string: '0123456789'
  , buf: Buffer.from('0123456789')
  , null: null
  , undefined: undefined
  , object: { foo: 'bar' }
}

console.log(facileClone(o))
/*  =>  { num: 1,
          bool: true,
          string: { type: 'string', len: 10, included: 0, val: '<deleted>' },
          buf: { type: 'Buffer', len: 10, included: 0, val: '<deleted>' },
          null: null,
          undefined: undefined,
          object: { type: 'object', val: '<deleted>' } } */

const bufObject = {
  buf: Buffer.from('0123456789')
}
console.log(facileClone(bufObject, { bufferLength: 5 }))
// => { buf: { type: 'Buffer', len: 10, included: 5, val: <Buffer 30 31 32 33 34> } }

const stringObject = {
  string: '0123456789'
}
console.log(facileClone(stringObject, { stringLength: 5 }))
// => { string: { type: 'string', len: 10, included: 5, val: '01234' } }
```

## Installation

    npm install facile-clone

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="facileClone"><span class="type-signature"></span>facileClone<span class="signature">(x, opts)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a shallow clone of the object, focusing on primitives and omitting
or clipping large values.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>x</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>the object to clone</p></td>
</tr>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>options to configure how large values are omitted/clipped</p>
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>bufferLength</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>if greater than <code>0</code> parts of buffers are included in the clone, default: <code>0</code></p></td>
</tr>
<tr>
<td class="name"><code>stringLength</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>if greater than <code>0</code> parts of strings are included in the clone, default: <code>0</code></p></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/facile-clone/blob/master/facile-clone.js">facile-clone.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/facile-clone/blob/master/facile-clone.js#L53">lineno 53</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT
