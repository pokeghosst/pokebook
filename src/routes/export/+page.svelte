<script>
    import { poemImage } from "../../stores/exported";
</script>

<h1 class="text-center pt-5 pb-5 text-lg">Here is the exported image of your poem. You can save or copy it~</h1>

<img src="{$poemImage.src}" alt="Exported poem" class="mx-auto"/>