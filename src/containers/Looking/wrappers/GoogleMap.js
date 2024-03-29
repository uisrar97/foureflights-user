import React, { useEffect, useRef,useState } from 'react';



export default function GoogleMap({ options, onMount, className, onMountProps }) {
  const ref = useRef()
  const [map, setMap] = useState()
  useEffect(() => {
    const onLoad = () => setMap(new window.google.maps.Map(ref.current, options))
    if (!window.google) {
      const script = document.createElement(`script`)
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUaBvvlXdLIxkhAVVqQJC7jhSg98g7NE`
      document.head.append(script)
      script.addEventListener(`load`, onLoad)
      return () => script.removeEventListener(`load`, onLoad)
    } else onLoad()
  }, [options])
  if (map && typeof onMount === `function`) onMount(map, onMountProps)
  return (
    <div
      style={{ height: `100vh`, borderRadius: `0.5em` }}
      {...{ ref, className }}
    />
  )
}
Map.defaultProps = {
  options: {
    center: { lat: 33.7269229, lng: 73.0849311 },
    zoom: 20,
  },
}


// const GoogleMap = styled.div`
//   width: 100%;
//   height: 700px;
// `;

