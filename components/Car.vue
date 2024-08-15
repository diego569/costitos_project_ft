<template>
    <div class="flex">
        <div class="min-w-lg rounded-lg bg-white shadow-lg">
            <div class="flex justify-between">
                <h2 class="text-xl font-semibold">
                    <slot name="title" />
                </h2>
                <div class="mb-6 flex justify-end">
                    <span class="rounded-full bg-gray-200 text-sm text-gray-600">
                        <slot name="items" />
                    </span>
                </div>
            </div>

            <div class="flex flex-col">
                <slot name="default" />
            </div>
            <div class="mt-8 border-t pt-4">
                <slot name="button" />
            </div>
        </div>
    </div>
</template>
