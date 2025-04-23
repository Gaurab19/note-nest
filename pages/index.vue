<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- sidebar -->
    <div class="bg-black w-[338px] p-8 flex flex-col overflow-scroll">
      <div>
        <Logo />
      </div>

      <!-- today main container -->
      <div class="flex-grow">
        <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Today</p>
        <div class="ml-2 space-y-2">
          <div
              v-for="note in todaysNotes"
              class="p-2 rounded-lg cursor-pointer"
              :class="{
              'bg-[#A1842C]': note.id === selectedNote.id,
              'hover:bg-[#A1842C]/50': note.id !== selectedNote.id,
            }"
              @click="setNote(note)"
          >
            <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
              {{ note.title || note.text.substring(0, 50) }}
            </h3>
            <div class="leading-none truncate text-[#D6D6D6]">
              <span class="text-xs text-[#F4F4F5] mr-4">{{
                  new Date(note.updatedAt).toLocaleDateString()
                }}</span>
              <span v-if="note.text.length > 50" class="text-xs text-[#D6D6D6]"
              >... {{ note.text.substring(50, 100) }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- /today main container -->

      <!-- yesterday main container -->
      <div>
        <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Yesterday</p>
        <div class="ml-2 space-y-2">
          <div
              v-for="note in yesterdaysNotes"
              class="p-2 rounded-lg cursor-pointer"
              :class="{
              'bg-[#A1842C]': note.id === selectedNote.id,
              'hover:bg-[#A1842C]/50': note.id !== selectedNote.id,
            }"
              @click="setNote(note)"
          >
            <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
              {{ note.title || note.text.substring(0, 50) }}
            </h3>
            <div class="leading-none truncate text-[#D6D6D6]">
              <span class="text-xs text-[#F4F4F5] mr-4">{{
                  new Date(note.updatedAt).toDateString() ===
                  new Date().toDateString()
                      ? 'Today'
                      : new Date(note.updatedAt).toLocaleDateString()
                }}</span>
              <span v-if="note.text.length > 50" class="text-xs text-[#D6D6D6]"
              >... {{ note.text.substring(50, 100) }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- /yesterday main container -->

      <!-- everything else main container -->
      <div>
        <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Earlier</p>
        <div class="ml-2 space-y-2">
          <div
              v-for="note in earlierNotes"
              class="p-2 rounded-lg cursor-pointer"
              :class="{
              'bg-[#A1842C]': note.id === selectedNote.id,
              'hover:bg-[#A1842C]/50': note.id !== selectedNote.id,
            }"
              @click="setNote(note)"
          >
            <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
              {{ note.title || note.text.substring(0, 50) }}
            </h3>
            <div class="leading-none truncate text-[#D6D6D6]">
              <span class="text-xs text-[#F4F4F5] mr-4">{{
                  new Date(note.updatedAt).toDateString() ===
                  new Date().toDateString()
                      ? 'Today'
                      : new Date(note.updatedAt).toLocaleDateString()
                }}</span>
              <span v-if="note.text.length > 50" class="text-xs text-[#D6D6D6]"
              >... {{ note.text.substring(50, 100) }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- /everything else main container -->
    </div>
    <!-- /sidebar -->

    <!-- note container -->
    <div class="w-full flex flex-col">
      <div class="flex justify-between w-full items-start p-8">
        <button
            class="inline-flex items-center text-xs text-[#C2C2C5] hover:text-white font-bold space-x-2"
            @click="openNewNoteModal"
        >
          <PencilIcon />
          <span>Create Note</span>
        </button>

        <div class="flex space-x-4">
          <button
              v-if="selectedNote.id"
              class="inline-flex items-center text-xs text-[#C2C2C5] hover:text-white font-bold space-x-2"
              @click="openEditNoteModal"
          >
            <PencilIcon />
            <span>Edit Note</span>
          </button>
          <button>
            <TrashIcon
                class="text-[#6D6D73] hover:text-white"
                @click="deleteNote"
            />
          </button>
        </div>
      </div>

      <div v-if="selectedNote.id" class="max-w-[437px] mx-auto w-full flex-grow flex flex-col">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-white mb-2">{{ selectedNote.title || 'Untitled Note' }}</h2>
          <p class="text-[#929292] font-playfair">
            {{ new Date(selectedNote.updatedAt).toLocaleDateString() }}
          </p>
        </div>
        <textarea
            ref="textarea"
            v-model="updatedNote"
            name="note"
            id="note"
            class="text-[#D4D4D4] my-4 font-playfair w-full bg-transparent focus:outline-none resize-none flex-grow"
            @input="
            () => {
              debouncedFn()
              selectedNote.text = updatedNote
            }
          "
        >
        </textarea>
      </div>
      <div v-else class="flex-grow flex items-center justify-center">
        <p class="text-zinc-500">Select a note or create a new one</p>
      </div>

      <button
          class="text-zinc-400 hover:text-white text-sm font-bold absolute right-0 bottom-0 p-8"
          @click="logout"
      >
        Logout
      </button>
    </div>
    <!-- /note container -->

    <!-- Note Modal -->
    <div v-if="showNoteModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-zinc-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-white text-xl font-bold mb-4">{{ isEditMode ? 'Edit Note' : 'Create New Note' }}</h2>

        <div class="mb-4">
          <label for="noteTitle" class="block text-sm font-medium text-zinc-400 mb-1">Title</label>
          <input
              type="text"
              id="noteTitle"
              v-model="noteFormData.title"
              class="w-full p-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#A1842C]"
              placeholder="Enter note title"
          >
        </div>

        <div class="mb-6">
          <label for="noteContent" class="block text-sm font-medium text-zinc-400 mb-1">Content</label>
          <textarea
              id="noteContent"
              v-model="noteFormData.content"
              class="w-full p-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#A1842C] min-h-32"
              placeholder="Enter note content"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
              @click="closeNoteModal"
              class="px-4 py-2 text-zinc-300 hover:text-white"
          >
            Cancel
          </button>
          <button
              @click="saveNote"
              class="px-4 py-2 bg-[#A1842C] text-white rounded-md hover:bg-[#8C7021]"
              :disabled="isLoading"
          >
            <span v-if="isLoading">Saving...</span>
            <span v-else>{{ isEditMode ? 'Update Note' : 'Save Note' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {toast} from "vue3-toastify";

const updatedNote = ref('')
const notes = ref([])
const selectedNote = ref({})
const textarea = ref(null)
const isLoading = ref(false)

// Combined modal control variables
const showNoteModal = ref(false)
const isEditMode = ref(false)
const noteFormData = ref({
  title: '',
  content: ''
})

definePageMeta({
  middleware: ['auth'],
})

function setNote(note) {
  selectedNote.value = note
  updatedNote.value = note.text
}

function openNewNoteModal() {
  isEditMode.value = false
  noteFormData.value = {
    title: '',
    content: ''
  }
  showNoteModal.value = true
}

function openEditNoteModal() {
  if (!selectedNote.value.id) return

  isEditMode.value = true
  noteFormData.value = {
    title: selectedNote.value.title || '',
    content: selectedNote.value.text || ''
  }
  showNoteModal.value = true
}

function closeNoteModal() {
  showNoteModal.value = false
}

async function saveNote() {
  isLoading.value = true
  try {
    if (isEditMode.value) {
      await updateFullNote()
    } else {
      await createNewNoteWithData()
    }

    // Refresh the notes list from API after adding or updating
    await refreshNotes()
    closeNoteModal()
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}

async function refreshNotes() {
  const updatedNotes = await $fetch('/api/notes')
  notes.value = updatedNotes
  notes.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  // If we're in edit mode, find and select the same note
  // Otherwise in create mode, select the first (newest) note
  if (isEditMode.value && selectedNote.value.id) {
    const updatedSelectedNote = notes.value.find(note => note.id === selectedNote.value.id)
    if (updatedSelectedNote) {
      selectedNote.value = updatedSelectedNote
      updatedNote.value = updatedSelectedNote.text
    }
  } else {
    if (notes.value.length > 0) {
      selectedNote.value = notes.value[0]
      updatedNote.value = selectedNote.value.text
    }
  }
}

async function createNewNoteWithData() {
  try {
    await $fetch(`/api/notes`, {
      method: 'POST',
      body: {
        title: noteFormData.value.title,
        text: noteFormData.value.content
      }
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function updateFullNote() {
  try {
    await $fetch(`/api/notes/${selectedNote.value.id}`, {
      method: 'PATCH',
      body: {
        title: noteFormData.value.title,
        updatedNote: noteFormData.value.content,
      },
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

function logout() {
  const jwtCookie = useCookie('NoteNestJWT')
  jwtCookie.value = null
  navigateTo('/login')
}

async function deleteNote() {
  if (!selectedNote.value.id) return
    isLoading.value = true
    try {
      // truly delete
      await $fetch(`/api/notes/${selectedNote.value.id}`, {
        method: 'DELETE',
      }).then((res)=>{
        if(res){
          toast.success('Deleted Successfully!', {multiple:false,autoClose: 1500});
        }
      })

      // Refresh notes after deletion
      await refreshNotes()

      // If no notes left, clear selection
      if (notes.value.length === 0) {
        selectedNote.value = {}
        updatedNote.value = ''
      }
    } catch (err) {
      console.log(err)
    } finally {
      isLoading.value = false
    }
}

const debouncedFn = useDebounceFn(async () => {
  await updateNote()
}, 1000)

async function updateNote() {
  try {
    await $fetch(`/api/notes/${selectedNote.value.id}`, {
      method: 'PATCH',
      body: {
        updatedNote: updatedNote.value,
      },
    })
  } catch (err) {
    console.log(err)
  }
}

const todaysNotes = computed(() => {
  return notes.value.filter((note) => {
    const noteDate = new Date(note.updatedAt)
    return noteDate.toDateString() === new Date().toDateString()
  })
})

const yesterdaysNotes = computed(() => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return notes.value.filter((note) => {
    const noteDate = new Date(note.updatedAt)
    return noteDate.toDateString() === yesterday.toDateString()
  })
})

const earlierNotes = computed(() => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return notes.value.filter((note) => {
    const noteDate = new Date(note.updatedAt)
    return (
        noteDate < yesterday &&
        noteDate.toDateString() !== yesterday.toDateString()
    )
  })
})

onMounted(async () => {
  await refreshNotes()

  if (notes.value.length > 0) {
    selectedNote.value = notes.value[0]
    updatedNote.value = selectedNote.value.text
    if (textarea.value) textarea.value.focus()
  }
})
</script>