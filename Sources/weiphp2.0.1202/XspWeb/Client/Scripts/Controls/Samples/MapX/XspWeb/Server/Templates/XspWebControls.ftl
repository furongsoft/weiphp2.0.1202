<#macro TextBox id name="" style="" class="" data_options="" value="" readOnly="">
<input type="text" id="${id}" 
    <#if name?length gt 0>name="${name}"<#else>name="${id}"</#if>
    <#if style?length gt 0>style="${style}"</#if>
    <#if class?length gt 0>class="${class}"</#if>
    <#if data_options?length gt 0>data-options="${data_options}"</#if>
    <#if value?length gt 0>value="${value}"</#if>
    <#if readOnly?length gt 0>readOnly="${readOnly}"</#if>
/>
</#macro>

<#macro PasswordBox id name="" style="" class="" data_options="" validType="">
<input type="password" id="${id}"
    <#if name?length gt 0>name="${name}"<#else>name="${id}"</#if>
    <#if style?length gt 0>style="${style}"</#if>
    <#if class?length gt 0>class="${class}"</#if>
    <#if data_options?length gt 0>data-options="${data_options}"</#if>
    <#if validType?length gt 0>validType="${validType}"</#if>
/>
</#macro>

<#macro Hidden id name="" value="">
<input type="hidden" id="${id}"
    <#if name?length gt 0>name="${name}"<#else>name="${id}"</#if>
    <#if value?length gt 0>value="${value}"</#if>
/>
</#macro>

<#macro TextArea id name="" cols="" rows="" style="">
<textarea id="${id}"
    <#if name?length gt 0>name="${name}"<#else>name="${id}"</#if>
    <#if style?length gt 0>style="${style}"</#if>
    <#if cols?length gt 0>cols="${cols}"</#if>
    <#if rows?length gt 0>rows="${rows}"</#if>
><#nested></textarea>
</#macro>

<#macro DropDownList id name="" class="" data_options="" style="">
<select id="${id}"
    <#if name?length gt 0>name="${name}"<#else>name="${id}"</#if>
    <#if class?length gt 0>class="${class}"</#if>
    <#if data_options?length gt 0>data-options="${data_options}"</#if>
    <#if style?length gt 0>style="${style}"</#if>
><#nested></select>
</#macro>