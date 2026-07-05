import { Build, Category, Role } from '@/app/data/build';
import { Slot } from '@/app/data/structures';
import { getUserDetails } from '@/app/data/SupabaseHandler';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cp1 = Date.now();
    const { id } = await params;
    const build = await Build.getBuild(Number(id));

    if (!build) {
      return new Response('Build not found', { status: 404 });
    }

    const cp2 = Date.now();
    console.log(`Time taken to fetch build: ${cp2 - cp1}ms`);
    
    const userDetails = await getUserDetails(build.submittedBy);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const bgTemplateUrl = `${siteUrl}/images/Embed_Background.png`;

    const cp3 = Date.now();
    console.log(`Time taken to fetch user details: ${cp3 - cp2}ms`);

    const pirataOneFont = await fetch(
      new URL('/fonts/PirataOne-Regular.ttf', siteUrl)
    ).then((res) => res.arrayBuffer());
    
    const cp4 = Date.now();
    console.log(`Time taken to fetch Pirata One font: ${cp4 - cp3}ms`);

    const barlowBoldFont = await fetch(
      new URL('/fonts/Barlow-Bold.ttf', siteUrl)
    ).then((res) => res.arrayBuffer());
    
    const cp5 = Date.now();
    console.log(`Time taken to fetch Barlow Bold font: ${cp5 - cp4}ms`);

    const barlowBlackFont = await fetch(
      new URL('/fonts/Barlow-Black.ttf', siteUrl)
    ).then((res) => res.arrayBuffer());
    
    const cp6 = Date.now();
    console.log(`Time taken to fetch Barlow Black font: ${cp6 - cp5}ms`);

    const nameFontSize = 
      build.name.length > 24 ? 72 : 
      build.name.length > 16 ? 96 : 
      128;

    // Helper to render text spans
    const renderTextSpan = (top: string, left: string, fontSize: number, fontWeight: string, children: string) => (
      <span
        style={{
          position: 'absolute',
          top,
          left,
          color: 'white',
          fontSize,
          fontFamily: 'Barlow',
          fontWeight,
          wordWrap: 'break-word',
          textShadow: fontSize <= 32 ? '0px 4px 10px rgba(0, 0, 0, 0.50)' : 'none'
        }}
      >
        {children}
      </span>
    );

    // Helper to render build item images
    const renderBuildImage = (src: string | undefined, alt: string, top: string, left: string) => (
      <img
        src={src || ''}
        alt={alt}
        style={{
          position: 'absolute',
          top,
          left,
        }}
        width={230}
        height={230}
      />
    );

    // Helper to render spell displays
    const renderSpellDisplay = (iconTop: string, iconLeft: string, textTop: string, textLeft: string, icon: string | undefined, name: string | undefined) => (
      <>
        <img
          src={icon || ''}
          alt="Spell Icon"
          style={{
            position: 'absolute',
            top: iconTop,
            left: iconLeft,
          }}
          width={80}
          height={80}
        />
        {renderTextSpan(textTop, textLeft, 24, '700', name || '')}
      </>
    );

    const cp7 = Date.now();
    console.log(`Time taken to prepare render helpers: ${cp7 - cp6}ms`);

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'relative',
            backgroundColor: 'transparent', // Keeps your template transparency intact
          }}
        >
          {/* Layer 1: Figma Static Background Template */}
          <img
            src={bgTemplateUrl}
            alt="Background Background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1920, // Forces pixel-perfect alignment match
              height: 1080,
            }}
            width={1920}
            height={1080}
          />

          <span
            style={{
              position: 'absolute',
              top: '9px',
              left: '30px',
              width: 986, 
              color: 'white', 
              fontSize: nameFontSize, 
              fontFamily: 'Pirata One', 
              fontWeight: '400', 
              wordWrap: 'break-word', 
              textShadow: '0px 7px 4px rgba(0, 0, 0, 0.45)'
            }}
          >
            {build.name}
          </span>

          <img
            src={userDetails?.imageUrl || ''}
            alt="Discord DP"
            style={{
              position: 'absolute',
              top: 146,
              left: 163,
              borderRadius: 100
            }}
            width={53}
            height={53}
          />

          {renderTextSpan("154px", "223px", 32, "700", userDetails?.name || "Anon")}

          {renderTextSpan("203px", "30px", 32, "700", Role[build?.role as keyof typeof Role])}

          {renderTextSpan("241px", "30px", 32, "700", Category[build?.category as keyof typeof Category][0])}

          <span
            style={{
              position: 'absolute',
              top: '154px',
              left: '799px',
              color: 'white', 
              fontSize: 64, 
              fontFamily: 'Barlow', 
              fontWeight: '900', 
              wordWrap: 'break-word'
            }}
          >
            {build.getBaseAverageIp()}
          </span>

          {renderBuildImage(build.helmet?.icon, "Helmet Icon", "54px", "1379px")}
          {renderBuildImage(build.cape?.icon, "Cape Icon", "54px", "1654px")}
          {renderBuildImage(build.weapon?.icon, "Weapon Icon", "320px", "1107px")}
          {renderBuildImage(build.armor?.icon, "Armor Icon", "320px", "1379px")}
          <img
            src={build.weapon?.isOneHanded() ? build.offhand?.icon || '' : build.weapon?.icon || ''}
            alt="Weapon Icon"
            style={{
              position: 'absolute',
              top: "320px",
              left: "1654px",
              opacity: build.weapon?.isOneHanded() ? 1 : 0.5,
            }}
            width={230}
            height={230}
          />
          {renderBuildImage(build.potion?.icon, "Potion Icon", "587px", "1107px")}
          {renderBuildImage(build.boots?.icon, "Boots Icon", "587px", "1379px")}
          {renderBuildImage(build.food?.icon, "Food Icon", "587px", "1654px")}
          
          {renderSpellDisplay("335px", "43px", "360px", "123px", build.weapon?.getSpell(Slot.FIRST_SLOT, build.weapon?.firstSpell || 0)?.icon, build.weapon?.getSpell(Slot.FIRST_SLOT, build.weapon?.firstSpell || 0)?.name)}
          {renderSpellDisplay("415px", "43px", "441px", "123px", build.weapon?.getSpell(Slot.SECOND_SLOT, build.weapon?.secondSpell || 0)?.icon, build.weapon?.getSpell(Slot.SECOND_SLOT, build.weapon?.secondSpell || 0)?.name)}
          {renderSpellDisplay("335px", "544px", "360px", "624px", build.weapon?.getSpell(Slot.THIRD_SLOT, 0)?.icon, build.weapon?.getSpell(Slot.THIRD_SLOT, 0)?.name)}
          {renderSpellDisplay("416px", "544px", "441px", "624px", build.weapon?.getSpell(Slot.PASSIVE, 0)?.icon, build.weapon?.getSpell(Slot.PASSIVE, 0)?.name)}
          
          {renderSpellDisplay("567px", "43px", "592px", "123px", build.armor?.activeSpells[build.armor?.activeSpell || 0]?.icon, build.armor?.activeSpells[build.armor?.activeSpell || 0]?.name)}
          {renderSpellDisplay("647px", "43px", "673px", "123px", build.armor?.passiveSpells[build.armor?.passive || 0]?.icon, build.armor?.passiveSpells[build.armor?.passive || 0]?.name)}
          
          {renderSpellDisplay("567px", "557px", "592px", "637px", build.helmet?.activeSpells[build.helmet?.activeSpell || 0]?.icon, build.helmet?.activeSpells[build.helmet?.activeSpell || 0]?.name)}
          {renderSpellDisplay("647px", "557px", "673px", "637px", build.helmet?.passiveSpells[build.helmet?.passive || 0]?.icon, build.helmet?.passiveSpells[build.helmet?.passive || 0]?.name)}
          
          {renderSpellDisplay("799px", "43px", "825px", "123px", build.boots?.activeSpells[build.boots?.activeSpell || 0]?.icon, build.boots?.activeSpells[build.boots?.activeSpell || 0]?.name)}
          {renderSpellDisplay("879px", "43px", "906px", "123px", build.boots?.passiveSpells[build.boots?.passive || 0]?.icon, build.boots?.passiveSpells[build.boots?.passive || 0]?.name)}

        </div>
      ),
      {
        width: 1920,  // Canvas dimension targets 
        height: 1080, // Canvas dimension targets
        fonts: [
          {
            name: 'Pirata One',  // Matches the exact spelling used in fontFamily string
            data: pirataOneFont,      // Passes the raw binary payload buffer array
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Barlow',
            data: barlowBoldFont,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'Barlow',
            data: barlowBlackFont,
            style: 'normal',
            weight: 900,
          }
        ],
      }
    );

    const cp8 = Date.now();
    console.log(`Time taken to generate image response: ${cp8 - cp7}ms`);

    return imageResponse;
  } catch (error) {
    return new Response('Failed to generate image asset layer', { status: 500 });
  }
}
