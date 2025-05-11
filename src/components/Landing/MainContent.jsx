import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

const MainContent = ({ 
  isMobile, 
  onComprarClick, 
  planetaNombre, 
  resumenCurso, 
  beneficios, 
  peligros, 
  imagenResumen, 
  imagenBeneficios,
  texturaPlaneta
}) => {
    const [activeSection, setActiveSection] = useState('inicio');
    const [navCollapsed, setNavCollapsed] = useState(isMobile);
    const [cartItems, setCartItems] = useState(() => {
        // Cargar carrito desde localStorage al iniciar
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('planetCart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });
    const [showCart, setShowCart] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    
    // Refs
    const mainContainerRef = useRef(null);
    const sectionRefs = {
        inicio: useRef(null),
        resumen: useRef(null),
        riesgos: useRef(null),
        beneficios: useRef(null),
        comprar: useRef(null)
    };

    // Actualizar localStorage cuando cambia el carrito
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('planetCart', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Función para desplazarse a una sección
    const scrollToSection = useCallback((section) => {
        const sectionRef = sectionRefs[section];
        if (!sectionRef.current || !mainContainerRef.current) return;
        
        mainContainerRef.current.scrollTo({
            top: sectionRef.current.offsetTop - (isMobile ? 80 : 100),
            behavior: 'smooth'
        });
        
        if (isMobile) {
            setNavCollapsed(true);
        }
        setActiveSection(section);
    }, [isMobile, sectionRefs]);

    // Efecto para detectar el scroll
    useEffect(() => {
        const container = mainContainerRef.current;
        if (!container) return;
        
        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            
            for (const [section, ref] of Object.entries(sectionRefs)) {
                if (ref.current) {
                    const sectionTop = ref.current.offsetTop - 100;
                    const sectionBottom = sectionTop + ref.current.offsetHeight;
                    
                    if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                        
                        break;
                    }
                }
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [sectionRefs]);

    useEffect(() => {
        setNavCollapsed(isMobile);
    }, [isMobile]);

    // Función para agregar al carrito
    const handleAddToCart = () => {
        const newItem = {
            id: `curso-${planetaNombre.toLowerCase()}`,
            name: `Seguridad en ${planetaNombre}`,
            price: 49.99,
            quantity: 1,
            planeta: planetaNombre,
            textura: texturaPlaneta,
            fecha: new Date().toISOString()
        };
        
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === newItem.id);
            const updatedItems = existingItem 
                ? prevItems.map(item => 
                    item.id === newItem.id 
                        ? {...item, quantity: item.quantity + 1} 
                        : item
                )
                : [...prevItems, newItem];
            
            return updatedItems;
        });
        
        setShowCart(true);
        setJustAdded(true);
        
        if (onComprarClick) onComprarClick();
        
        setTimeout(() => setJustAdded(false), 3000);
    };

    // Función para eliminar del carrito
    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Función para obtener la URL correcta de la textura
    const getTextureUrl = (texturePath) => {
        if (!texturePath) return '';
        // Si ya es una URL completa, devolverla tal cual
        if (texturePath.startsWith('http') || texturePath.startsWith('data:')) {
            return texturePath;
        }
        // Si es una ruta relativa, asegurarse de que empiece con /
        return texturePath.startsWith('/') ? texturePath : `/${texturePath}`;
    };

    // Estilos comunes
    const navButtonStyle = (section) => ({
        background: 'none',
        border: 'none',
        color: activeSection === section ? '#ff0099' : 'white',
        fontSize: isMobile ? '14px' : '16px',
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        textShadow: activeSection === section ? '0 0 10px rgb(255, 0, 153)' : 'none',
        fontWeight: activeSection === section ? 'bold' : 'normal',
        whiteSpace: 'nowrap',
        ':hover': {
            color: '#ff0099',
            textShadow: '0 0 10px rgb(255, 0, 153)',
        }
    });

    return (
        <div ref={mainContainerRef} style={{
            position: 'absolute',
            zIndex: 2,
            top: isMobile ? '0px' : '0px',
            bottom: isMobile ? '100px' : '120px',
            left: 0,
            width: '100%',
            minHeight: '84%',
            color: 'white',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            marginBottom: isMobile ? '900px' : '900px',
        }}>
            {/* Carrito de compras mejorado */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}>
                <button 
                    onClick={() => setShowCart(!showCart)}
                    style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: `1px solid ${justAdded ? '#00ff00' : '#ff0099'}`,
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        boxShadow: justAdded ? '0 0 20px rgba(0, 255, 0, 0.7)' : '0 0 10px rgba(255, 0, 153, 0.5)',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                    }}
                >
                    🛒 
                    {cartItems.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: justAdded ? '#00ff00' : '#ff0099',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            boxShadow: justAdded ? '0 0 10px rgba(0, 255, 0, 0.7)' : '0 0 5px rgba(255, 0, 153, 0.5)'
                        }}>
                            {cartItems.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    )}
                </button>
                
                {showCart && (
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid #ff0099',
                        borderRadius: '15px',
                        padding: '20px',
                        marginTop: '15px',
                        width: isMobile ? '280px' : '350px',
                        boxShadow: '0 0 25px rgba(255, 0, 153, 0.7)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px',
                            borderBottom: '1px solid rgba(255, 0, 153, 0.5)',
                            paddingBottom: '10px'
                        }}>
                            <h3 style={{ 
                                margin: 0,
                                fontSize: '24px',
                                color: '#ff0099',
                                textShadow: '0 0 10px rgba(255, 0, 153, 0.7)'
                            }}>
                                Mis Cursos Espaciales
                            </h3>
                            <button 
                                onClick={() => setShowCart(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ff0099',
                                    fontSize: '20px',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        
                        {cartItems.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#aaa'
                            }}>
                                <p>Tu nave está vacía</p>
                                <p>¡Agrega cursos para comenzar tu aventura!</p>
                            </div>
                        ) : (
                            <>
                                <ul style={{ 
                                    listStyle: 'none', 
                                    padding: 0,
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    margin: '0 -10px'
                                }}>
                                    {cartItems.map(item => (
                                        <li key={`${item.id}-${item.fecha}`} style={{
                                            display: 'flex',
                                            gap: '15px',
                                            alignItems: 'center',
                                            marginBottom: '15px',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            background: 'rgba(30, 30, 30, 0.5)',
                                            position: 'relative',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {/* Círculo con textura del planeta */}
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: `url(${getTextureUrl(item.textura)})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                boxShadow: '0 0 15px rgba(255, 0, 153, 0.5)',
                                                border: '2px solid rgba(255, 0, 153, 0.3)'
                                            }} />
                                            
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontWeight: 'bold',
                                                    marginBottom: '5px'
                                                }}>
                                                    {item.name}
                                                </div>
                                                <div style={{ 
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '14px'
                                                }}>
                                                    <span>
                                                        {item.quantity} x ${item.price.toFixed(2)}
                                                    </span>
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                style={{
                                                    background: 'rgba(255, 0, 153, 0.2)',
                                                    border: 'none',
                                                    color: '#ff0099',
                                                    cursor: 'pointer',
                                                    fontSize: '18px',
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 0, 153, 0.5)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 0, 153, 0.2)';
                                                }}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                
                                <div style={{
                                    marginTop: '20px',
                                    borderTop: '1px solid rgba(255, 0, 153, 0.5)',
                                    paddingTop: '15px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '15px',
                                        fontSize: '18px',
                                        fontWeight: 'bold'
                                    }}>
                                        <span>Total:</span>
                                        <span>
                                            ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            console.log('Proceder al pago', cartItems);
                                        }}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(45deg, #ff0099, #ff0066)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 0 15px rgba(255, 0, 153, 0.5)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.8)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 153, 0.5)';
                                        }}
                                    >
                                        🚀 Proceder al Pago
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* NavBar colapsable */}
            <nav style={{
                position: 'sticky',
                top: isMobile ? '20px' : '32px',
                left: 0,
                right: 0,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                padding: '10px 20px',
                boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                zIndex: 1000,
                border: '1px solid rgba(255, 0, 153, 0.3)',
                margin: '10px auto',
                maxWidth: isMobile ? (navCollapsed ? '12%' : '32%') : '40%',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                maxHeight: isMobile ? (navCollapsed ? '40px' : '500px') : 'none',
            }}>
                {isMobile && (
                    <button 
                        onClick={() => setNavCollapsed(!navCollapsed)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '8px',
                            alignSelf: 'center',
                            marginBottom: navCollapsed ? '0' : '10px',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = '#ff0099';
                            e.currentTarget.style.textShadow = '0 0 10px rgb(255, 0, 153)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.textShadow = 'none';
                        }}
                    >
                        {navCollapsed ? '☰' : '✕'}
                    </button>
                )}
                
                <ul style={{
                    display: isMobile && navCollapsed ? 'none' : 'flex',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    gap: isMobile ? '10px' : '20px',
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                    justifyContent: 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'center' : 'normal',
                    width: isMobile ? '100%' : 'auto',
                }}>
                    {Object.keys(sectionRefs).map((section) => (
                        <li key={section} style={{
                            width: isMobile ? '100%' : 'auto',
                            textAlign: isMobile ? 'center' : 'left',
                        }}>
                            <button 
                                onClick={() => scrollToSection(section)}
                                style={{
                                    ...navButtonStyle(section),
                                    width: isMobile ? '100%' : 'auto',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.color = '#ff0099';
                                    e.currentTarget.style.textShadow = '0 0 10px rgb(255, 0, 153)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.color = activeSection === section ? '#ff0099' : 'white';
                                    e.currentTarget.style.textShadow = activeSection === section ? '0 0 10px rgb(255, 0, 153)' : 'none';
                                }}
                            >
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Sección Inicio */}
            <div ref={sectionRefs.inicio}>
                <h1 style={{    
                    position: 'relative',
                    fontSize: isMobile ? '44px' : '56px',
                    paddingTop: '0px',
                    textAlign: 'center',
                    marginBottom: '800px',
                    color: '#ffffff',
                    textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)',
                    
                }}>
                    🚀 Bienvenidos al Planeta {planetaNombre} 🪐
                </h1>
            </div>

            {/* Sección Resumen */}
            <div ref={sectionRefs.resumen} style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: isMobile ? '20px' : '40px',
                marginBottom: '60px',
                marginTop: isMobile ? '20px' : '40px',
                gap: isMobile ? '20px' : '40px',
                boxSizing: 'border-box',
            }}>
                <img
                    src={imagenResumen}
                    alt="Imagen del Resumen"
                    style={{
                        width: isMobile ? '100%' : '40%',
                        maxWidth: '100%',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                />
                
                <div className="rgb-border" style={{
                    fontSize: isMobile ? '22px' : '32px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '24px',
                    borderRadius: '10px',
                    width: isMobile ? '100%' : '50%',
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    border: '1px solid transparent',
                    boxSizing: 'border-box',
                    transition: 'transform 0.3s ease',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                >
                    <h2 style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>📖 Resumen del Curso</h2>
                    <p>{resumenCurso}</p>
                </div>
            </div>

            {/* Sección Riesgos */}
            <div ref={sectionRefs.riesgos} style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: isMobile ? '20px' : '40px',
                marginBottom: '60px',
                gap: '20px',
                boxSizing: 'border-box',
            }}>
                <div className="rgb-border" style={{
                    fontSize: isMobile ? '22px' : '32px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '24px',
                    borderRadius: '10px',
                    width: '100%',
                    maxWidth: '1000px',
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    border: '1px solid transparent',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                }}>
                    <h2 style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>⚠️ Riesgos del Planeta {planetaNombre}</h2>
                    <p>
                        El planeta es un lugar fascinante, pero también está lleno de peligros. A continuación,
                        te presentamos algunos de los riesgos más importantes que debes conocer antes de explorar este
                        increíble mundo. 🌌
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                    boxSizing: 'border-box',
                }}>
                    {peligros.map((peligro, index) => (
                        <PeligroCard key={index} peligro={peligro} isMobile={isMobile} />
                    ))}
                </div>
            </div>

            {/* Sección Beneficios */}
            <div ref={sectionRefs.beneficios} style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: isMobile ? '20px' : '40px',
                marginBottom: '60px',
                gap: isMobile ? '20px' : '40px',
                boxSizing: 'border-box',
            }}>
                <img
                    src={imagenBeneficios}
                    alt="Imagen de Beneficios"
                    style={{
                        width: isMobile ? '100%' : '40%',
                        maxWidth: '100%',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                />

                <div className="rgb-border" style={{
                    fontSize: isMobile ? '20px' : '24px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '24px',
                    borderRadius: '10px',
                    width: isMobile ? '100%' : '50%',
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    border: '1px solid transparent',
                    boxSizing: 'border-box',
                }}>
                    <h2 style={{ fontSize: '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>🌟 Beneficios</h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}>
                        {beneficios.map((beneficio, index) => (
                            <BeneficioItem key={index} beneficio={beneficio} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Sección Comprar */}
            <div ref={sectionRefs.comprar} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '20px',
                marginBottom: '120px',
                boxSizing: 'border-box',
            }}>
                <button onClick={handleAddToCart} className="rgb-border" style={{
                    fontSize: '24px',
                    background: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '15px 50px',
                    borderRadius: '12px',
                    boxShadow: '0 0 15px rgba(255, 0, 153, 0.5)',
                    textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 0, 153, 0.2)';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 153, 0.8)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 153, 0.5)';
                }}
                >
                    🛒 Agregar al Carrito
                    
                </button>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '24px',
                textAlign: 'center',
                color: '#ffffff',
                textShadow: '0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.5)',
                marginTop: '40px',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(5px)',
                boxShadow: '0 -5px 15px rgba(255, 0, 0, 0.3)',
                border: 'none',
                borderTop: '1px solid rgba(255, 0, 0, 0.2)',
            }}>
                <p style={{ 
                    margin: '0', 
                    fontSize: isMobile ? '24px' : '28px',
                    fontWeight: '300',
                }}>
                    © 2023 Exploración Espacial Mundo Dictario. Todos los derechos reservados.
                </p>
                <p style={{ 
                    margin: '10px 0 0', 
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: '300',
                }}>
                    Desarrollado con ❤️ por el equipo de Mundo Dictario.
                </p>
            </footer>
    
        </div>
    );
};

const PeligroCard = ({ peligro, isMobile }) => (
    <div className="rgb-border" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '24px',
        borderRadius: '10px',
        width: isMobile ? '100%' : '30%',
        boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
        border: '1px solid transparent',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontSize: isMobile ? '22px' : '28px',
        minHeight: isMobile ? '22px' : '660px',
    }}
    onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 153, 0.8)';
    }}
    onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.5)';
    }}
    >
        <h2 style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>{peligro.nombre}</h2>
        <p><strong>📝 Descripción:</strong> {peligro.descripcion}</p>
        <p><strong>🚨 Nivel de Riesgo:</strong> {peligro.nivelRiesgo}</p>
        <p><strong>🌡️ Temperatura:</strong> {peligro.temperatura}</p>
        <p><strong>👹 Villano:</strong> {peligro.villano}</p>
        <button className="rgb-border" style={{
            background: 'none',
            color: '#ffffff',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '12px 24px',
            borderRadius: '12px',
            marginTop: '20px',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 10px rgba(255, 0, 153, 0.5)',
            textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 0, 153, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.8)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 153, 0.5)';
        }}
        >
            {peligro.cta}
        </button>
    </div>
);

const BeneficioItem = ({ beneficio }) => (
    <div className="rgb-border" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 0, 153, 0.3)',
        border: '1px solid transparent',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
    }}
    onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 153, 0.5)';
    }}
    onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 153, 0.3)';
    }}
    >
        <h3 style={{ fontSize: '32px', marginBottom: '10px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>{beneficio.titulo}</h3>
        <p>{beneficio.descripcion}</p>
    </div>
);

export default MainContent;