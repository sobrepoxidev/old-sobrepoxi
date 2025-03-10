"use client";

import React, { useState, useRef, useCallback } from "react";
import { useCart } from "@/components/context/CartContext";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { Database } from '@/types-db';
import { useSupabase } from "@/app/supabase-provider/provider";
type UserTicket = Database['user_tickets'];

// ------------------- 1) Lista de stickers base -------------------
const BASE_STICKERS = [
  { id: 1, name: "Mr. App 51", imageUrl: "/stickers/51.png" },
  { id: 2, name: "Mr. App 52", imageUrl: "/stickers/52.png" },
  { id: 3, name: "Mr. App 53", imageUrl: "/stickers/53.png" },
  { id: 4, name: "Mr. App 54", imageUrl: "/stickers/54.png" },
];

// ------------------- 2) Componente Draggable -------------------
type DraggableProps = {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrop?: (x: number, y: number) => void;
};

const Draggable = ({
  children,
  initialPosition,
  onPositionChange,
  onDragStart,
  onDragEnd,
  onDrop,
}: DraggableProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    onDragStart?.();
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.preventDefault();
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    onDragEnd?.();
    onPositionChange({ x: position.x, y: position.y });
    onDrop?.(e.clientX, e.clientY);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
 

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        touchAction: "none",
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      {children}
    </div>
  );
};

// ------------------- 3) CustomizationOptions -------------------
type CustomizationOptionsProps = {
  stickers: { id: number; name: string; imageUrl: string }[];
  addSticker: (sticker: { id: number; name: string; imageUrl: string }) => void;
  customText: string;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textInputRef: React.RefObject<HTMLInputElement | null>;
  handleAddText: () => void;
  handleDownload: () => void;
  handleUploadSticker: (file: File) => void;
};

const CustomizationOptions = ({
  stickers,
  addSticker,
  customText,
  handleTextChange,
  textInputRef,
  handleAddText,
  handleDownload,
  handleUploadSticker,
}: CustomizationOptionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejamos el input file
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadSticker(file);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4 text-center text-lg">
        Opciones de personalización
      </h3>

      {/* Selección de stickers */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Selecciona un sticker:</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {stickers.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => addSticker(sticker)}
              className="border p-2 rounded border-gray-300 hover:border-blue-500 transition bg-white dark:bg-gray-600"
            >
              <Image
                src={sticker.imageUrl}
                alt={sticker.name}
                width={40}
                height={40}
              />
            </button>
          ))}
          {/* Botón para subir imagen como sticker */}
          <div className="border p-2 rounded border-gray-300 bg-white dark:bg-gray-600 hover:border-blue-500 transition cursor-pointer relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onFileChange}
            />
            <div className="flex flex-col items-center justify-center text-sm text-gray-500">
              <Image
                src="/upload.png"
                alt="Subir"
                width={24}
                height={24}
              />
              <span className="text-xs mt-1">Agregar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agregar texto */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Agregar texto:</p>
        <input
          ref={textInputRef}
          type="text"
          value={customText}
          onChange={handleTextChange}
          placeholder="Escribe algo..."
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 dark:bg-gray-800"
        />
        <button
          onClick={handleAddText}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          disabled={!customText.trim()}
        >
          Añadir texto al card
        </button>
      </div>

      {/* Botón de descarga */}
      <div>
        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
        >
          Descargar Poxicard
        </button>
      </div>
    </div>
  );
};

// ------------------- 4) Tipos y definición de “text overlays” y “stickers” en la tarjeta -------------------
type AddedSticker = {
  uid: string;
  sticker: { id: number; name: string; imageUrl: string };
  position: { x: number; y: number };
};

type AddedText = {
  uid: string;
  text: string;
  position: { x: number; y: number };
};

type EditableCardProps = {
  card: UserTicket;
};

// ------------------- 5) Componente EditableCard -------------------
const EditableCard = ({ card }: EditableCardProps) => {
  // Stickers base + subidos
  const [myStickers, setMyStickers] = useState([...BASE_STICKERS]);

  // Stickers agregados al card
  const [addedStickers, setAddedStickers] = useState<AddedSticker[]>([]);

  // Múltiples textos agregados al card
  const [addedTexts, setAddedTexts] = useState<AddedText[]>([]);

  // Texto que escribe el usuario en el input
  const [customText, setCustomText] = useState("");

  // Control de drag y vista
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "customize">("preview");

  // Referencias
  const downloadRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // ++++++++ LÓGICA DE STICKERS +++++++++
  const addSticker = useCallback(
    (sticker: { id: number; name: string; imageUrl: string }) => {
      const uid = Date.now().toString() + Math.random().toString(36).slice(2);
      const newSticker: AddedSticker = {
        uid,
        sticker,
        position: { x: 10, y: 10 + addedStickers.length * 20 },
      };
      setAddedStickers((prev) => [...prev, newSticker]);

      // En móvil, volver a la pestaña preview
      if (window.innerWidth < 768) {
        setActiveTab("preview");
      }
    },
    [addedStickers]
  );

  const removeSticker = useCallback((uid: string) => {
    setAddedStickers((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  const updateStickerPosition = useCallback(
    (uid: string, newPosition: { x: number; y: number }) => {
      setAddedStickers((prev) =>
        prev.map((sticker) =>
          sticker.uid === uid ? { ...sticker, position: newPosition } : sticker
        )
      );
    },
    []
  );

  // ++++++++ LÓGICA DE TEXTOS MÚLTIPLES +++++++++
  const addText = useCallback(() => {
    const textValue = customText.trim();
    if (!textValue) return;

    const uid = Date.now().toString() + Math.random().toString(36).slice(2);
    const newText: AddedText = {
      uid,
      text: textValue,
      position: { x: 50, y: 50 },
    };

    setAddedTexts((prev) => [...prev, newText]);
    setCustomText("");

    // En móvil, volver a la pestaña preview
    if (window.innerWidth < 768) {
      setActiveTab("preview");
    }
  }, [customText]);

  const removeText = useCallback((uid: string) => {
    setAddedTexts((prev) => prev.filter((t) => t.uid !== uid));
  }, []);

  const updateTextPosition = useCallback((uid: string, newPos: { x: number; y: number }) => {
    setAddedTexts((prev) =>
      prev.map((txt) =>
        txt.uid === uid ? { ...txt, position: newPos } : txt
      )
    );
  }, []);

  // Comprobar si se suelta en el basurero
  const isDroppedInTrash = (x: number, y: number) => {
    if (trashRef.current) {
      const rect = trashRef.current.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
    return false;
  };

  // Drop handlers
  const handleStickerDrop = useCallback(
    (uid: string) => (x: number, y: number) => {
      if (isDroppedInTrash(x, y)) {
        removeSticker(uid);
      }
    },
    [removeSticker]
  );

  const handleTextDrop = useCallback(
    (uid: string) => (x: number, y: number) => {
      if (isDroppedInTrash(x, y)) {
        removeText(uid);
      }
    },
    [removeText]
  );

  // ++++++++ SUBIR IMAGEN COMO STICKER +++++++++
  const handleUploadSticker = useCallback((file: File) => {
    const newUrl = URL.createObjectURL(file);
    const newSticker = {
      id: Date.now(),
      name: file.name,
      imageUrl: newUrl,
    };
    setMyStickers((prev) => [...prev, newSticker]);
  }, []);

  // ++++++++ Manejo del Texto del Input +++++++++
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomText(e.target.value);
  }, []);

  // ++++++++ Descargar la Poxicard +++++++++
  const handleDownload = useCallback(async () => {
    if (downloadRef.current) {
      try {
        const canvas = await html2canvas(downloadRef.current, { backgroundColor: null });
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${card.premio.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      }
    }
  }, [card.premio]);  const { session } = useSupabase();
  const nombreUsuario = session?.user?.user_metadata?.name;

  // ---------------------- CardPreview ----------------------
  const CardPreview = () => (
    <div ref={downloadRef} className="relative w-full max-w-xs mx-auto">
      <div className="relative">
        {isDragging && (
          <div
            ref={trashRef}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-red-400 p-2 rounded-full shadow-md"
            style={{ width: "30px", height: "30px" }}
          >
            <Image src="/stickers/trash.svg" alt="Basurero" width={25} height={25} />
          </div>
        )}

        <div className="relative overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 transition-transform duration-300 hover:shadow-xl">
          <div className="absolute top-2 left-2 z-10 bg-indigo-600 bg-opacity-90 text-white px-3 py-1 rounded-md text-xs font-semibold backdrop-blur-md">
            Sobrepoxi
          </div>
          <div className="relative w-full h-40 rounded-md overflow-hidden">
            {card.image_url ? (
              <Image src={card.image_url} alt={card.premio} fill style={{ objectFit: "cover" }} />
            ) : (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                📷 Sin imagen
              </div>
            )}

            {/* Stickers */}
            {addedStickers.map((item) => (
              <Draggable
                key={item.uid}
                initialPosition={item.position}
                onPositionChange={(pos) => updateStickerPosition(item.uid, pos)}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onDrop={handleStickerDrop(item.uid)}
              >
                <Image
                  src={item.sticker.imageUrl}
                  alt={item.sticker.name}
                  width={50}
                  height={50}
                />
              </Draggable>
            ))}

            {/* Textos (múltiples) */}
            {addedTexts.map((txt) => (
              <Draggable
                key={txt.uid}
                initialPosition={txt.position}
                onPositionChange={(pos) => updateTextPosition(txt.uid, pos)}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onDrop={handleTextDrop(txt.uid)}
              >
                <div
                  style={{
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#fff",
                    WebkitTextStroke: "2px #000",
                    textShadow: "3px 3px 0 #000",
                  }}
                >
                  {txt.text}
                </div>
              </Draggable>
            ))}
          </div>

          {/* Info de la Tarjeta */}
          <div className="mt-4 space-y-2">
            <h2 className="text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {card.premio}
            </h2>
            <h3 className="text-sm md:text-base font-bold text-indigo-400 dark:text-indigo-200">{ nombreUsuario }</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div>
                <span className="font-semibold">Número: </span>
                <span className="text-indigo-600 dark:text-indigo-400">{card.number}</span>
              </div>
              <div>
                <span className="font-semibold">Serie: </span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {card.serie || "000"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div>
                <span className="font-semibold">Fecha: </span>
                <span>{card.date}</span>
              </div>
              <div>
                <span className="font-semibold">Hora: </span>
                <span>{card.time.slice(0, 5)}</span>
              </div>
            </div>
            <div className="flex flex-row justify-between mt-3">
              <div className="flex-1 flex justify-start items-start">
                <p className="text-base md:text-lg font-semibold text-green-600 dark:text-green-400">
                  ₡{card.costo}
                </p>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <QRCodeSVG value="https://example.com/ticket" size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ------------------- Render principal -------------------
  return (
    <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full mx-auto">
      {/* Tabs en móvil */}
      <div className="flex md:hidden mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 text-center rounded-md transition ${
            activeTab === "preview" ? "bg-blue-600 text-white font-medium" : "text-gray-700"
          }`}
        >
          Ver Tarjeta
        </button>
        <button
          onClick={() => setActiveTab("customize")}
          className={`flex-1 py-2 text-center rounded-md transition ${
            activeTab === "customize" ? "bg-blue-600 text-white font-medium" : "text-gray-700"
          }`}
        >
          Personalizar
        </button>
      </div>

      {/* Botón flotante para descargar en móvil */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
        >
          <Image src="/download.png" alt="Descargar" width={24} height={24} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vista previa */}
        <div
          className={`lg:w-1/2 flex flex-col items-center ${
            activeTab === "preview" || window.innerWidth >= 768 ? "block" : "hidden"
          }`}
        >
          <CardPreview />
        </div>

        {/* Personalización */}
        <div
          className={`lg:w-1/2 ${
            activeTab === "customize" || window.innerWidth >= 768 ? "block" : "hidden"
          }`}
        >
          <CustomizationOptions
            stickers={myStickers}
            addSticker={addSticker}
            customText={customText}
            handleTextChange={handleTextChange}
            textInputRef={textInputRef}
            handleAddText={addText}     
            handleDownload={handleDownload}
            handleUploadSticker={handleUploadSticker}
          />
        </div>
      </div>
    </div>
  );
};

// ------------------- 6) Página principal -------------------
export default function PersonalizacionPage() {
  const { cartBuyed } = useCart();

  return (
    <main className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 py-14">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        Personaliza tus PoxiCards
      </h1>
      {cartBuyed.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No tienes PoxiCards para personalizar.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {cartBuyed.map((card) => (
            <EditableCard key={card.local_id} card={card} />
          ))}
        </div>
      )}
    </main>
  );
}
