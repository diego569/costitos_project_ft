<!-- <template>
    <div
        class="bg-primary-500/10 text-primary-500 enabled:hover:bg-primary-500/20 active:enabled:bg-primary-500/10 undefined hover:ring-primary-500 relative inline-flex h-8 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-center text-sm transition-all duration-300 hover:opacity-80 hover:ring-1 hover:ring-inset disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:px-4">
        <slot />
    </div>
</template> -->

<template>
    <button type="button" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"><slot /></button>
</template>
