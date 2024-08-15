<template>
    <a class="block cursor-pointer rounded-lg border border-primary-200 bg-white px-4 py-8 text-center shadow-primary-400/10 transition-all duration-300 hover:bg-primary-300 hover:shadow-xl hover:dark:shadow-primary-800/10">
        <h3 class="font-heading text-base font-semibold text-primary-800">
            <slot name="title"></slot>
        </h3>
        <p class="sr-only font-sans text-sm text-primary-500 dark:text-primary-400">
            <slot name="description"></slot>
        </p>
    </a>
</template>
